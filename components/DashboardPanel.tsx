// components/DashboardPanel.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { FeatureCollection} from 'geojson';
import { useQueryState } from 'nuqs';
import type { MarkdownStory } from '@/types';
import MarkdownStoryDetailView from "./MarkdownStoryDetailView";

interface DashboardPanelProps {
    selectedMdStory: MarkdownStory | null;
    featureCollection: FeatureCollection;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({
    selectedMdStory,
    featureCollection,
}) => {
    const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');
    const setSelectedStoryId = useQueryState("story")[1]

    if (selectedMdStory) {
        return <MarkdownStoryDetailView story={selectedMdStory} />;
    } else {
        return (
            <div className="dashboard-panel">
                <div className="dashboard-header">
                    <div className="header-text">
                        <h2>Wisconsin Climate Table Stories</h2>
                        <p className="header-subtitle">{featureCollection.features.length} stories across the state</p>
                    </div>
                    <div className="view-toggles">
                        <button
                            className={viewMode === 'gallery' ? 'active' : ''}
                            onClick={() => setViewMode('gallery')}
                            title="Gallery view"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                            </svg>
                        </button>
                        <button
                            className={viewMode === 'list' ? 'active' : ''}
                            onClick={() => setViewMode('list')}
                            title="List view"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="3" y="4" width="18" height="3" rx="1" />
                                <rect x="3" y="10.5" width="18" height="3" rx="1" />
                                <rect x="3" y="17" width="18" height="3" rx="1" />
                            </svg>
                        </button>
                    </div>
                </div>
    
                <div className="dashboard-content">
                    {viewMode === 'gallery' ? (
                        <div className="gallery-view">
                            {featureCollection.features.map(story => {
                                const props = story.properties;
                                if (props != null) {
                                    return (
                                        <div
                                            key={props.name as string}
                                            className="story-card"
                                            onClick={() => setSelectedStoryId(props.id)}
                                        >
                                            <div className="card-image">
                                                {props.heroImage ? (
                                                    <img src={props.heroImage} alt={props.name} />
                                                ) : (
                                                    <div className="card-image-fallback" />
                                                )}
                                                <span className="card-category-badge">{props.role}</span>
                                            </div>
                                            <div className="card-content">
                                                <h3>{props.name}</h3>
                                                <p className="card-description">{props.neighborhood}</p>
                                                {props.date && (
                                                    <span className="card-date">{new Date(props.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    ) : (
                        <div className="list-view">
                            {featureCollection.features.map(story => {
                                const props = story.properties;
                                if (props != null) {
                                    return (
                                        <div
                                            key={props.name as string}
                                            className="list-item"
                                            onClick={() => setSelectedStoryId(props.id)}
                                        >
                                            <div className="list-item-image">
                                                {props.heroImage ? (
                                                    <img src={props.heroImage} alt={props.name} />
                                                ) : (
                                                    <div className="list-item-image-fallback" />
                                                )}
                                            </div>
                                            <div className="list-item-content">
                                                <h4>{props.name}</h4>
                                                <p>{props.neighborhood}</p>
                                            </div>
                                            <span className="list-category">{props.role}</span>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    )}
                </div>
    
                <style jsx>{`
                    .dashboard-panel {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        background: #f8fafb;
                    }
    
                    .dashboard-header {
                        padding: 20px 24px;
                        background: #ffffff;
                        border-bottom: 1px solid #e5e7eb;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
    
                    .header-text h2 {
                        margin: 0;
                        font-size: 1.35rem;
                        font-weight: 700;
                        color: #111827;
                        font-family: inherit;
                    }
    
                    .header-subtitle {
                        margin: 4px 0 0 0;
                        font-size: 0.82rem;
                        color: #6b7280;
                    }
    
                    .view-toggles {
                        display: flex;
                        gap: 0;
                        border: 1px solid #d1d5db;
                        border-radius: 8px;
                        overflow: hidden;
                    }
    
                    .view-toggles button {
                        padding: 8px 12px;
                        border: none;
                        background: #ffffff;
                        cursor: pointer;
                        color: #6b7280;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                    }
    
                    .view-toggles button + button {
                        border-left: 1px solid #d1d5db;
                    }
    
                    .view-toggles button.active {
                        background: #0d7377;
                        color: #ffffff;
                    }
    
                    .view-toggles button:hover:not(.active) {
                        background: #f3f4f6;
                    }
    
                    .dashboard-content {
                        flex: 1;
                        overflow-y: auto;
                        padding: 20px;
                    }
    
                    /* Custom scrollbar */
                    .dashboard-content::-webkit-scrollbar {
                        width: 6px;
                    }
                    .dashboard-content::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .dashboard-content::-webkit-scrollbar-thumb {
                        background: #d1d5db;
                        border-radius: 3px;
                    }
                    .dashboard-content::-webkit-scrollbar-thumb:hover {
                        background: #9ca3af;
                    }
    
                    /* ── Gallery View ── */
                    .gallery-view {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                        gap: 16px;
                    }
    
                    .story-card {
                        background: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
                        overflow: hidden;
                        cursor: pointer;
                        transition: transform 0.2s ease, box-shadow 0.25s ease;
                        border: 1px solid #f0f0f0;
                    }
    
                    .story-card:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    }
    
                    .card-image {
                        position: relative;
                        height: 140px;
                        overflow: hidden;
                    }
    
                    .card-image img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.3s ease;
                    }
    
                    .story-card:hover .card-image img {
                        transform: scale(1.05);
                    }
    
                    .card-image-fallback {
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #e0f7fa, #b2dfdb);
                    }
    
                    .card-category-badge {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        font-size: 0.7rem;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        padding: 3px 8px;
                        border-radius: 20px;
                        background: rgba(255,255,255,0.92);
                        color: #0d7377;
                        backdrop-filter: blur(4px);
                    }
    
                    .card-content {
                        padding: 14px 16px 16px;
                    }
    
                    .card-content h3 {
                        margin: 0 0 6px 0;
                        font-size: 1rem;
                        font-weight: 600;
                        color: #111827;
                        line-height: 1.3;
                        font-family: inherit;
                    }
    
                    .card-description {
                        margin: 0 0 8px 0;
                        font-size: 0.85rem;
                        color: #6b7280;
                        line-height: 1.4;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
    
                    .card-date {
                        font-size: 0.78rem;
                        color: #9ca3af;
                    }
    
                    /* ── List View ── */
                    .list-view {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }
    
                    .list-item {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                        padding: 12px 14px;
                        background: #ffffff;
                        border-radius: 10px;
                        cursor: pointer;
                        border: 1px solid #f0f0f0;
                        transition: all 0.2s;
                    }
    
                    .list-item:hover {
                        border-color: #0d7377;
                        box-shadow: 0 2px 8px rgba(13,115,119,0.08);
                    }
    
                    .list-item-image {
                        width: 56px;
                        height: 56px;
                        border-radius: 8px;
                        overflow: hidden;
                        flex-shrink: 0;
                    }
    
                    .list-item-image img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
    
                    .list-item-image-fallback {
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #e0f7fa, #b2dfdb);
                    }
    
                    .list-item-content {
                        flex: 1;
                        min-width: 0;
                    }
    
                    .list-item-content h4 {
                        margin: 0 0 3px 0;
                        font-size: 0.95rem;
                        font-weight: 600;
                        color: #111827;
                        font-family: inherit;
                    }
    
                    .list-item-content p {
                        margin: 0;
                        font-size: 0.82rem;
                        color: #6b7280;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
    
                    .list-category {
                        font-size: 0.72rem;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        color: #0d7377;
                        background: #e0f7fa;
                        padding: 4px 10px;
                        border-radius: 20px;
                        white-space: nowrap;
                        flex-shrink: 0;
                    }
                `}</style>
            </div>
        )
    }

}

export default DashboardPanel
