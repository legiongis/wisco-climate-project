// components/Map.tsx
"use client"

import React, {
    useEffect, useRef,
} from "react"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"

import type {
    AnyStoryFeature
} from '@/types';

import { WISCONSIN_BOUNDARY, WISCONSIN_CENTER } from '@/data/wisconsinValues';

// Marker styling
const DEFAULT_MARKER_STYLE: L.CircleMarkerOptions = {
    radius: 8,
    fillColor: "#0d7377",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.85
};

const SELECTED_MARKER_STYLE: L.CircleMarkerOptions = {
    radius: 11,
    fillColor: "#ff6b35",
    color: "#ffffff",
    weight: 3,
    opacity: 1,
    fillOpacity: 0.95
};

// WCT circle styles (1-mile radius geographic circles)
const WCT_CIRCLE_STYLE: L.PathOptions = {
    fillColor: "#991b1b",
    color: "#ffffff",
    weight: 2,
    opacity: 0.9,
    fillOpacity: 0.35
};

const WCT_CIRCLE_SELECTED_STYLE: L.PathOptions = {
    fillColor: "#ff6b35",
    color: "#ffffff",
    weight: 3,
    opacity: 1,
    fillOpacity: 0.5
};

const CIRCLE_RADIUS_METERS = 402; // 0.5 mile diameter = 0.25 mile radius

// Helper to get tooltip label from either story type
function getTooltipLabel(story: AnyStoryFeature): string {
    const props = story.properties;
    if ('title' in props && typeof props.title === 'string') {
        return props.title;
    }
    if ('name' in props && typeof props.name === 'string') {
        return props.name as string;
    }
    return 'Story';
}

interface MapComponentProps {
    stories: AnyStoryFeature[];
    selectedStory: AnyStoryFeature | null;
    onStorySelect: (story: AnyStoryFeature) => void;
    storyType?: "demo" | "wct";
}

const MapComponent: React.FC<MapComponentProps> = ({
    stories,
    selectedStory,
    onStorySelect,
    storyType = "demo",
}) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const leafletMapRef = useRef<L.Map | null>(null)
    const storiesLayerRef = useRef<L.LayerGroup | null>(null)

    // Initialize map
    useEffect(() => {
        if (mapRef.current && typeof window !== "undefined") {
            if (!leafletMapRef.current) {
                const initialCenter: [number, number] = storyType === "wct"
                    ? [43.06, -87.95]  // Milwaukee centered for WCT stories
                    : WISCONSIN_CENTER;
                const initialZoom = storyType === "wct" ? 11 : 7;

                const currentLeafletMap = L.map(mapRef.current, {
                    zoomControl: false,
                }).setView(initialCenter, initialZoom)
                leafletMapRef.current = currentLeafletMap;

                // Position zoom control bottom-right
                L.control.zoom({ position: 'bottomright' }).addTo(currentLeafletMap);

                // Use a clean, modern tile layer
                L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
                    maxZoom: 19,
                }).addTo(currentLeafletMap);

                // Add Wisconsin Boundary with subtle fill
                L.geoJSON(WISCONSIN_BOUNDARY as any, {
                    style: {
                        color: "#0d7377",
                        weight: 2,
                        opacity: 0.5,
                        fillColor: "#e0f7fa",
                        fillOpacity: 0.08,
                        dashArray: '6, 4'
                    }
                }).addTo(currentLeafletMap);
            }

            // Update Stories Layer
            if (leafletMapRef.current) {
                if (storiesLayerRef.current) {
                    leafletMapRef.current.removeLayer(storiesLayerRef.current);
                }

                const layerGroup = L.layerGroup();

                if (storyType === "wct") {
                    // WCT: 1-mile radius circles
                    stories.forEach(story => {
                        const { coordinates } = story.geometry;
                        const [lng, lat] = coordinates;
                        const label = getTooltipLabel(story);

                        const circle = L.circle([lat, lng], {
                            radius: CIRCLE_RADIUS_METERS,
                            ...WCT_CIRCLE_STYLE,
                        });

                        circle.bindTooltip(label, {
                            direction: 'top',
                            offset: [0, -10],
                            className: 'story-tooltip'
                        });

                        circle.on('click', () => {
                            onStorySelect(story);
                        });

                        // Store a reference to the story on the layer for selection logic
                        (circle as any)._storyId = story.properties.id;

                        circle.addTo(layerGroup);
                    });
                } else {
                    // Demo: circle markers (pixel-based)
                    const storiesCollection = {
                        type: "FeatureCollection",
                        features: stories
                    } as any;

                    const geoJsonLayer = L.geoJSON(storiesCollection, {
                        pointToLayer: (_feature, latlng) => {
                            return L.circleMarker(latlng, DEFAULT_MARKER_STYLE);
                        },
                        onEachFeature: (feature, layer) => {
                            const storyFeature = feature as AnyStoryFeature;
                            const label = getTooltipLabel(storyFeature);
                            layer.bindTooltip(label, {
                                direction: 'top',
                                offset: [0, -10],
                                className: 'story-tooltip'
                            });

                            layer.on({
                                click: () => {
                                    onStorySelect(storyFeature);
                                }
                            });
                        }
                    });

                    geoJsonLayer.addTo(layerGroup);
                }

                layerGroup.addTo(leafletMapRef.current);
                storiesLayerRef.current = layerGroup;
            }
        }

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
                storiesLayerRef.current = null;
            }
        };
    }, []);

    // Handle Selection Highlight + flyTo / reset
    useEffect(() => {
        if (!leafletMapRef.current || !storiesLayerRef.current) return;

        if (storyType === "wct") {
            // Reset all circles, then highlight selected
            storiesLayerRef.current.eachLayer((layer) => {
                if (layer instanceof L.Circle) {
                    layer.setStyle(WCT_CIRCLE_STYLE);
                }
            });

            if (selectedStory) {
                const { coordinates } = selectedStory.geometry;
                const [lng, lat] = coordinates;
                leafletMapRef.current.flyTo([lat, lng], 13, { duration: 1.2 });

                storiesLayerRef.current.eachLayer((layer) => {
                    if (layer instanceof L.Circle && (layer as any)._storyId === selectedStory.properties.id) {
                        layer.setStyle(WCT_CIRCLE_SELECTED_STYLE);
                        layer.bringToFront();
                    }
                });
            } else {
                leafletMapRef.current.flyTo([43.06, -87.95], 11, { duration: 1.0 });
            }
        } else {
            // Demo stories: circle markers
            storiesLayerRef.current.eachLayer((outerLayer) => {
                if (outerLayer instanceof L.GeoJSON) {
                    outerLayer.eachLayer((layer) => {
                        if (layer instanceof L.CircleMarker) {
                            layer.setStyle(DEFAULT_MARKER_STYLE);
                            layer.setRadius(DEFAULT_MARKER_STYLE.radius!);
                        }
                    });
                }
            });

            if (selectedStory) {
                const { coordinates } = selectedStory.geometry;
                const [lng, lat] = coordinates;
                leafletMapRef.current.flyTo([lat, lng], 10, { duration: 1.2 });

                storiesLayerRef.current.eachLayer((outerLayer) => {
                    if (outerLayer instanceof L.GeoJSON) {
                        outerLayer.eachLayer((layer) => {
                            if (layer instanceof L.CircleMarker) {
                                const feature = (layer as any).feature as AnyStoryFeature;
                                if (feature && feature.properties.id === selectedStory.properties.id) {
                                    layer.setStyle(SELECTED_MARKER_STYLE);
                                    layer.setRadius(SELECTED_MARKER_STYLE.radius!);
                                    layer.bringToFront();
                                }
                            }
                        });
                    }
                });
            } else {
                leafletMapRef.current.flyTo(WISCONSIN_CENTER, 7, { duration: 1.0 });
            }
        }
    }, [selectedStory]);

    return (
        <>
            <div id="map" ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
            <style jsx global>{`
                .story-tooltip {
                    background: rgba(17, 24, 39, 0.9);
                    color: #ffffff;
                    border: none;
                    border-radius: 6px;
                    padding: 6px 12px;
                    font-size: 0.82rem;
                    font-weight: 500;
                    font-family: inherit;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .story-tooltip::before {
                    border-top-color: rgba(17, 24, 39, 0.9) !important;
                }
                .leaflet-control-zoom a {
                    width: 32px !important;
                    height: 32px !important;
                    line-height: 32px !important;
                    font-size: 16px !important;
                    border-radius: 8px !important;
                    background: rgba(255,255,255,0.95) !important;
                    backdrop-filter: blur(8px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
                    border: 1px solid rgba(0,0,0,0.08) !important;
                    color: #374151 !important;
                }
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: none !important;
                }
                .leaflet-control-zoom a + a {
                    margin-top: 4px !important;
                }
            `}</style>
        </>
    )
}

export default React.memo(MapComponent)
