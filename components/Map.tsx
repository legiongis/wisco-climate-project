// components/Map.tsx
"use client"

import React, {
    useEffect, useRef,
} from "react"
import { FeatureCollection } from "geojson"
import * as L from "leaflet";
import "leaflet/dist/leaflet.css"

import { useQueryState } from "nuqs"

import type {
    AnyStoryFeature,
    MarkdownStory
} from '@/types';

import { WISCONSIN_BOUNDARY, WISCONSIN_CENTER } from '@/data/wisconsinValues';

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

function getRadius(zoom: number) {
    let radius: number;
    if (zoom <= 10) {
        radius = CIRCLE_RADIUS_METERS * 8;
    } else if (zoom <= 12) {
        radius = CIRCLE_RADIUS_METERS * 4;
    } else if (zoom <= 14) {
        radius  = CIRCLE_RADIUS_METERS * 2;
    } else {
        radius = CIRCLE_RADIUS_METERS;
    }
    return radius
}

interface MapComponentProps {
    featureCollection: FeatureCollection;
    selectedMdStory: MarkdownStory | null;
}

let FULLBOUNDS: L.LatLngBounds;

const MapComponent: React.FC<MapComponentProps> = ({
    featureCollection,
    selectedMdStory,
}) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const leafletMapRef = useRef<L.Map | null>(null)
    const storiesLayerRef = useRef<L.LayerGroup | null>(null)
    const selectedStoryMarkerRef = useRef<L.CircleMarker | null>(null)

    const setSelectedStoryId = useQueryState("story")[1]

    // Initialize map
    useEffect(() => {
        if (mapRef.current && typeof window !== "undefined") {
            if (!leafletMapRef.current) {

                const currentLeafletMap = L.map(mapRef.current, {
                    zoomControl: false,
                }).setView([43.06, -87.95], 12)
                leafletMapRef.current = currentLeafletMap;

                // Position zoom control bottom-right
                L.control.zoom({ position: 'bottomright' }).addTo(currentLeafletMap);

                // Use a clean, modern tile layer
                L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
                    maxZoom: 19,
                }).addTo(currentLeafletMap);

                // Add Wisconsin Boundary with subtle fill
                L.geoJSON(WISCONSIN_BOUNDARY, {
                    style: {
                        color: "#0d7377",
                        weight: 2,
                        opacity: 0.5,
                        fillColor: "#e0f7fa",
                        fillOpacity: 0.08,
                        dashArray: '6, 4'
                    }
                }).addTo(currentLeafletMap);

                // const clusterGroup = new MarkerClusterGroup({
                //     showCoverageOnHover: false,
                // }
                // );
                const storiesLayer = L.geoJSON(featureCollection, {
                    pointToLayer: function (feature, latlng) {
                        const circle = L.circle(latlng, {
                            radius: getRadius(currentLeafletMap.getZoom()),
                            ...WCT_CIRCLE_STYLE,
                        });

                        circle.bindTooltip(feature.properties.name, {
                            direction: 'top',
                            offset: [0, -10],
                            className: 'story-tooltip'
                        });

                        circle.on('click', () => {
                            // onStorySelect(feature.properties.id);
                            setSelectedStoryId(feature.properties.id)
                        });
                        circle.on('mouseover', () => {
                            circle.setStyle(WCT_CIRCLE_SELECTED_STYLE)
                        })
                        circle.on('mouseout', () => {
                            circle.setStyle(WCT_CIRCLE_STYLE)
                        })
                        return circle
                    }
                })

                storiesLayer.addTo(currentLeafletMap);
                FULLBOUNDS = storiesLayer.getBounds();
                currentLeafletMap.fitBounds(FULLBOUNDS);

                currentLeafletMap.on('zoomend', function() {
                    currentLeafletMap.eachLayer((lyr) => {
                        if (lyr instanceof L.CircleMarker) {
                            lyr.setRadius(getRadius(currentLeafletMap.getZoom()))
                        }
                    });
                });
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

    useEffect(() => {
        if (leafletMapRef.current) {
            if (selectedStoryMarkerRef.current) {
               leafletMapRef.current.removeLayer(selectedStoryMarkerRef.current)
            }
            if (selectedMdStory) {
                const latlng: L.LatLngExpression = [selectedMdStory.coords[1], selectedMdStory.coords[0]];
                const selectedCircle = L.circle(latlng, {
                    radius: getRadius(leafletMapRef.current.getZoom()),
                    ...WCT_CIRCLE_SELECTED_STYLE
                })
                selectedCircle.bindTooltip(selectedMdStory.name, {
                    direction: 'top',
                    offset: [0, -10],
                    className: 'story-tooltip'
                });
                selectedStoryMarkerRef.current = selectedCircle;

                leafletMapRef.current.addLayer(selectedStoryMarkerRef.current)
                leafletMapRef.current.flyTo(latlng, 15, { duration: 1.2 });
            } else {
                leafletMapRef.current.fitBounds(FULLBOUNDS)
            }
        }
    }, [selectedMdStory, leafletMapRef, selectedStoryMarkerRef])

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
