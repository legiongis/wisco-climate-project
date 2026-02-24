// app/wisco-climate-table/page.tsx
"use client";

import MapAndDashboardWrapper from '@/components/MapAndDashboardWrapper';
import { MOCK_STORIES } from '@/data/stories';

export default function WiscoClimateTablePage() {
    return (
        <MapAndDashboardWrapper
            stories={MOCK_STORIES}
            title="Wisconsin Climate Table Stories"
            titleClassName="text-red-600"
        />
    );
}
