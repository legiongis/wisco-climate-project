// components/WCTStoryDetailView.tsx
"use client"

import type React from "react"
import type { MarkdownStory } from '@/types';

import BackButton from "./BackButton";
import neighborhoodNotes from "../data/neighborhoods.json";

interface MarkdownStoryDetailViewProps {
    story: MarkdownStory;
}

const MarkdownStoryDetailView: React.FC<MarkdownStoryDetailViewProps> = ({ story }) => {
    const { name, role, neighborhood, heroImage, videoUrl, htmlContent, footerHtml } = story;
    let localeNote = ""
    if (neighborhood in neighborhoodNotes) {
        localeNote = neighborhoodNotes[neighborhood as keyof typeof neighborhoodNotes].note
    }

    return (
      <div className="wct-story-detail">
        
            <BackButton />
            {heroImage && (
                <div className="wct-hero-image">
                    <img src={heroImage} alt={name} />
                </div>
            )}

            <div className="wct-detail-content">
                <div className="wct-compound-title">
                    <h1 className="wct-name">{name}</h1>
                    <p className="wct-role">{role}</p>
                    <p className="wct-neighborhood">{neighborhood}
                        {localeNote && (
                            <>
                            <em> &mdash; {localeNote}</em>
                            </>
                        )}

                    </p>
                </div>

                {videoUrl && (
                    <iframe width="100%" height="400"
                        src={videoUrl}>
                    </iframe>
                )}

                <div className="wct-body" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                {footerHtml && (
                    <div className="story-footer" dangerouslySetInnerHTML={{ __html: footerHtml }}></div>
                )}
            </div>
            <style jsx>{`
                .wct-story-detail {
                    height: 100%;
                    overflow-y: auto;
                    background: #ffffff;
                    animation: wctSlideIn 0.3s ease-out;
                }

                @keyframes wctSlideIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .wct-detail-content {
                    padding: 24px;
                }

                /* Compound title */
                .wct-compound-title {
                    margin-bottom: 24px;
                }

                .wct-name {
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #991b1b;
                    margin: 0 0 4px 0;
                    line-height: 1.3;
                    font-family: inherit;
                }

                .wct-role,
                .wct-neighborhood {
                    font-size: 1rem;
                    color: #111827;
                    margin: 0;
                    line-height: 1.5;
                    font-weight: 500;
                }

                /* Body blocks — spacing between every block */
                .wct-body {
                    margin-top: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .wct-paragraph {
                    font-size: 0.95rem;
                    line-height: 1.7;
                    color: #374151;
                    margin: 0;
                }

                .wct-dialogue {
                    font-size: 0.95rem;
                    line-height: 1.7;
                    color: #374151;
                    padding-left: 16px;
                    border-left: 2px solid #e5e7eb;
                }

                .wct-inline-image {
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }

                .wct-inline-image img {
                    width: 100%;
                    display: block;
                }

                /* Video */
                .wct-video {
                    margin-top: 28px;
                }

                .wct-video h3 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 12px 0;
                    font-family: inherit;
                }

                .wct-video-wrapper {
                    position: relative;
                    padding-bottom: 56.25%;
                    height: 0;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .wct-video-wrapper iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                }
            `}</style>
            <style jsx global>{`
                .dialogue-speaker {
                    font-weight: 700;
                    color: #111827;
                }

                .note-label {
                    display: inline-block;
                    font-size: 0.72rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: #6b7280;
                    margin-bottom: 6px;
                }
            `}</style>
        </div>
    );
}
export default MarkdownStoryDetailView
