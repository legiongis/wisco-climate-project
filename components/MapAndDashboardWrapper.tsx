// components/MapAndDashboardWrapper.tsx
"use client"

import type React from "react"
import { useState, useCallback } from "react"
import dynamic from "next/dynamic"

import type {
    AnyStoryFeature
} from '@/types';

const DynamicMapComponent = dynamic(() => import("./Map"), {
    ssr: false,
    loading: () => (
        <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#f0f4f5', color: '#6b7280', fontFamily: 'system-ui, sans-serif'
        }}>
            Loading map…
        </div>
    ),
})

import DashboardPanel from "./DashboardPanel"

interface MapAndDashboardWrapperProps {
    stories: AnyStoryFeature[];
    title?: string;
    titleClassName?: string;
    storyType?: "demo" | "wct";
}

const MapAndDashboardWrapper: React.FC<MapAndDashboardWrapperProps> = ({
    stories: initialStories,
    title,
    titleClassName,
    storyType = "demo",
}) => {
    const [stories] = useState<AnyStoryFeature[]>(initialStories);
    const [selectedStory, setSelectedStory] = useState<AnyStoryFeature | null>(null);

    const handleStorySelect = useCallback((story: AnyStoryFeature) => {
        setSelectedStory(story);
    }, []);

    const handleStoryDeselect = useCallback(() => {
        setSelectedStory(null);
    }, []);

    return (
        <div className="map-dashboard-container">
            <div className="dashboard-area">
                <DashboardPanel
                    stories={stories}
                    selectedStory={selectedStory}
                    onStorySelect={handleStorySelect}
                    onStoryDeselect={handleStoryDeselect}
                    title={title}
                    titleClassName={titleClassName}
                    storyType={storyType}
                />
            </div>
            <div className="map-area">
                <DynamicMapComponent
                    stories={stories}
                    selectedStory={selectedStory}
                    onStorySelect={handleStorySelect}
                    storyType={storyType}
                />
            </div>

            <style jsx>{`
                .map-dashboard-container {
                    display: flex;
                    flex-direction: row;
                    height: 100vh;
                    width: 100%;
                    padding: 0;
                    box-sizing: border-box;
                    position: relative;
                }

                .dashboard-area {
                    flex: 1; /* 50% width — LEFT side */
                    height: 100%;
                    overflow: hidden;
                }

                .map-area {
                    flex: 1; /* 50% width — RIGHT side */
                    height: 100%;
                    border-left: 2px solid #e5e7eb;
                }
            `}</style>
        </div>
    )
}

export default MapAndDashboardWrapper
