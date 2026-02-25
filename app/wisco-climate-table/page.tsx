// app/wisco-climate-table/page.tsx
"use client";

import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper';
import { WCT_STORIES } from '@/data/wctStories';

export default function WiscoClimateTablePage() {
    return (
        <MapAndDashboardWrapper
            stories={WCT_STORIES}
            title="Wisconsin Climate Table Stories"
            titleClassName="text-red-600"
            storyType="wct"
        />
    );
}
