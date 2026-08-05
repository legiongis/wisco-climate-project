export interface MarkdownStory {
    id: string;
    name: string;
    role: string;
    neighborhood: string;
    heroImage: string;
    coords: [number, number];
    videoUrl?: string;
    htmlContent: string;
    footerHtml?: string;
}
