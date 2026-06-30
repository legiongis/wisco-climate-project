// components/StoryDetailView.tsx
"use client"

import type React from "react"
import type { StoryFeature } from '@/types';
import BackButton from "./BackButton";

interface StoryDetailViewProps {
    story: StoryFeature;
}

const StoryDetailView: React.FC<StoryDetailViewProps> = ({ story }) => {
    const { title, category, date, imageUrl, bodyText, videoUrl, galleryImages } = story.properties;

    return (
        <div className="story-detail">
            <BackButton />

            {imageUrl && (
                <div className="hero-image">
                    <img src={imageUrl} alt={title} />
                </div>
            )}

            <div className="detail-content">
                <div className="detail-meta">
                    <span className="detail-category">{category}</span>
                    {date && <span className="detail-date">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
                </div>
                <h1 className="detail-title">{title}</h1>

                <div className="detail-body">
                    {bodyText.split('\n\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                    ))}
                </div>

                {videoUrl && (
                    <div className="detail-video">
                        <h3>Watch the Story</h3>
                        <div className="video-wrapper">
                            <iframe
                                src={videoUrl}
                                title={`${title} Video`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}

                {galleryImages && galleryImages.length > 0 && (
                    <div className="detail-gallery">
                        <h3>Photo Gallery</h3>
                        <div className="gallery-grid">
                            {galleryImages.map((img, i) => (
                                <div key={i} className="gallery-item">
                                    <img src={img} alt={`${title} — Photo ${i + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .story-detail {
                    height: 100%;
                    overflow-y: auto;
                    background: #ffffff;
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .back-button {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 12px 20px;
                    background: none;
                    border: none;
                    border-bottom: 1px solid #e5e7eb;
                    cursor: pointer;
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: #0d7377;
                    width: 100%;
                    transition: background 0.2s;
                    font-family: inherit;
                }

                .back-button:hover {
                    background: #f0fdfa;
                }

                .hero-image {
                    width: 100%;
                    height: 220px;
                    overflow: hidden;
                }

                .hero-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .detail-content {
                    padding: 24px;
                }

                .detail-meta {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                }

                .detail-category {
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: #0d7377;
                    background: #e0f7fa;
                    padding: 4px 10px;
                    border-radius: 20px;
                }

                .detail-date {
                    font-size: 0.85rem;
                    color: #6b7280;
                }

                .detail-title {
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #111827;
                    margin: 0 0 20px 0;
                    line-height: 1.3;
                    font-family: inherit;
                }

                .detail-body p {
                    font-size: 0.95rem;
                    line-height: 1.7;
                    color: #374151;
                    margin: 0 0 16px 0;
                }

                .detail-video {
                    margin-top: 28px;
                }

                .detail-video h3,
                .detail-gallery h3 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #111827;
                    margin: 0 0 12px 0;
                    font-family: inherit;
                }

                .video-wrapper {
                    position: relative;
                    padding-bottom: 56.25%;
                    height: 0;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .video-wrapper iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: none;
                }

                .detail-gallery {
                    margin-top: 28px;
                }

                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 12px;
                }

                .gallery-item {
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .gallery-item:hover {
                    transform: scale(1.03);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                }

                .gallery-item img {
                    width: 100%;
                    height: 140px;
                    object-fit: cover;
                    display: block;
                }
            `}</style>
        </div>
    )
}

export default StoryDetailView
