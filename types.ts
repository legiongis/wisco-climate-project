// types.ts — Story types for Wisconsin Climate Stories

import type { Feature, Point, GeoJsonProperties } from 'geojson';

// --- Demo Story Types (existing) ---
export interface StoryKnownProperties {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl?: string;
    date?: string;
    bodyText: string;
    videoUrl?: string;
    galleryImages?: string[];
}

export interface MarkdownStory {
    id: string;
    name: string;           // rendered in dark red
    role: string;           // rendered in black
    neighborhood: string;   // rendered in black
    heroImage: string;      // photo below title, above quote
    coords: [number, number];
    videoUrl?: string;
    htmlContent: string;
}

export type StoryProperties = StoryKnownProperties & GeoJsonProperties;

export type StoryFeature = Feature<Point, StoryProperties>;

// --- Content Block Types (for rich story bodies) ---
export type ContentBlock =
    | { type: "paragraph"; text: string }
    | { type: "quote"; text: string }
    | { type: "image"; src: string; alt?: string }
    | { type: "dialogue"; speaker: string; text: string }
    | { type: "note"; text: string }

// --- WCT Story Types ---
export interface WCTStoryKnownProperties {
    id: string;
    name: string;           // rendered in dark red
    role: string;           // rendered in black
    neighborhood: string;   // rendered in black
    heroImage: string;      // photo below title, above quote
    videoUrl?: string;
    body: ContentBlock[];
}

export type WCTStoryProperties = WCTStoryKnownProperties & GeoJsonProperties;

export type WCTStoryFeature = Feature<Point, WCTStoryProperties>;

// --- Union type for components that accept either ---
export type AnyStoryFeature = StoryFeature | WCTStoryFeature;
