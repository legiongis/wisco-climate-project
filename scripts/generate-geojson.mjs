// scripts/generate-geojson.mjs
// Run as a prebuild step: "prebuild": "node scripts/generate-geojson.mjs"
// Requires: npm install gray-matter glob

import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";
import matter from "gray-matter";
import path from "path";

const STORIES_DIR = "public/content"; // adjust to your markdown directory
const OUTPUT_PATH = "public/stories-index.geojson"; // adjust to your desired output path

async function generateGeoJSON() {
  const files = await glob(`${STORIES_DIR}/**/*.md`);

  const features = files
    .map((filePath) => {
      const raw = readFileSync(filePath, "utf-8");
      const { data } = matter(raw);

      const { coords, ...rest } = data;
      console.log(filePath)
      rest.id = filePath.split("/").pop()
      console.log(rest)

      if (!coords) {
        console.warn(`Skipping ${path.basename(filePath)}: no coords found`);
        return null;
      }

      // coords frontmatter is a string like "-87.9298, 43.0561"
      const [longitude, latitude] = coords
        .split(",")
        .map((n) => parseFloat(n.trim()));

      if (isNaN(longitude) || isNaN(latitude)) {
        console.warn(`Skipping ${path.basename(filePath)}: invalid coords "${coords}"`);
        return null;
      }

      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        properties: rest,
      };
    })
    .filter(Boolean);

  const geojson = {
    type: "FeatureCollection",
    features,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(geojson, null, 2));
  console.log(`Generated ${features.length} features → ${OUTPUT_PATH}`);
}

generateGeoJSON().catch((err) => {
  console.error(err);
  process.exit(1);
});
