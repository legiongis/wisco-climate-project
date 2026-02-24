// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--gray-50,#f8fafb)] px-6">
      <h1 className="text-4xl font-extrabold text-[var(--foreground,#111827)] tracking-tight m-0">
        Wisconsin Climate Stories
      </h1>
      <p className="mt-2.5 mb-12 text-base text-[var(--gray-500,#6b7280)]">
        Select a story collection to explore
      </p>

      <div className="flex gap-7 flex-wrap justify-center">
        <Link
          href="/demo-stories"
          className="flex flex-col items-center justify-center gap-3.5 w-[260px] h-[180px] rounded-xl bg-white border border-[#f0f0f0] no-underline text-[var(--foreground,#111827)] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary,#0d7377)] hover:shadow-[0_8px_25px_rgba(13,115,119,0.12)]"
        >
          <span className="text-5xl">🗺️</span>
          <span className="text-lg font-semibold text-center">Demo Stories</span>
        </Link>
        <Link
          href="/wisco-climate-table"
          className="flex flex-col items-center justify-center gap-3.5 w-[260px] h-[180px] rounded-xl bg-white border border-[#f0f0f0] no-underline text-[var(--foreground,#111827)] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-red-600 hover:shadow-[0_8px_25px_rgba(220,38,38,0.12)]"
        >
          <span className="text-5xl">📊</span>
          <span className="text-lg font-semibold text-center">Wisco Climate Table Stories</span>
        </Link>
      </div>
    </div>
  );
}
