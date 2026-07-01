// components/MapAndDashboardWrapper.tsx
"use client"

import type React from "react"
import { FeatureCollection } from "geojson"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

import * as matter from 'gray-matter';
import { marked } from 'marked';

import { useQueryState } from 'nuqs'

import type {
    AnyStoryFeature,
    MarkdownStory
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
    stories?: AnyStoryFeature[];
    title?: string;
    titleClassName?: string;
    storyType?: "demo" | "wct";
}

async function processMarkdown(id: string, rawMarkdownString: string) {
    // workaround from ticket: https://github.com/jonschlinkert/gray-matter/issues/181
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parse = (matter as any).default || matter;
    const { data, content } = parse(rawMarkdownString);

    // Convert Markdown body to safe HTML string
    const htmlContent = await marked.parse(content, {gfm: true});

    const parsedStory: MarkdownStory = {
        id: id,
        name: data.name,
        neighborhood: data.neighborhood,
        role: data.role,
        heroImage: data.heroImage,
        htmlContent: htmlContent,
        coords: data.coords.split(",").map(Number)
    }

  return parsedStory;
}

const MapAndDashboardWrapper: React.FC<MapAndDashboardWrapperProps> = ({
    stories: initialStories,
    title,
    titleClassName,
    storyType = "demo",
}) => {
    const [stories] = useState<AnyStoryFeature[] | undefined>(initialStories);
    const [selectedStory, setSelectedStory] = useState<AnyStoryFeature | null>(null);
    const [selectedMdStory, setSelectedMdStory] = useState<MarkdownStory | null>(null);

    const selectedStoryId = useQueryState("story")[0];

    const [storiesGeojson, setStoriesGeojson] = useState<FeatureCollection>();

    const handleStorySelect = async function(storyId: string) {
        const res = await fetch(`/stories/${storyId}.md`);
        const text = await res.text()
        const mdStory = await processMarkdown(storyId, text)
        setSelectedMdStory(mdStory)
    }

    useEffect(() => {
        if (selectedStoryId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            handleStorySelect(selectedStoryId)
        } else {
            setSelectedStory(null);
            setSelectedMdStory(null);
        }
    }, [selectedStoryId])

    async function loadGeoJSON() {
        const response = await fetch('/stories/_index.geojson');
        const storiesGeojson = await response.json();
        setStoriesGeojson(storiesGeojson)
    }
    if (storiesGeojson === undefined) {
        loadGeoJSON()
    } else {
        return (
            <div className="map-dashboard-container">
                <div className="dashboard-area">
                    <DashboardPanel
                        selectedMdStory={selectedMdStory}
                        title={title}
                        titleClassName={titleClassName}
                        featureCollection={storiesGeojson}
                    />
                </div>
                <div className="map-area">
                    <DynamicMapComponent
                        selectedMdStory={selectedMdStory}
                        featureCollection={storiesGeojson}
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

}

export default MapAndDashboardWrapper
