"use client";

import { useMemo, useState } from "react";
import { NoticesHero } from "@/components/notices/notices-hero";
import { NoticesList } from "@/components/notices/notices-list";
import { NoticesSidebar } from "@/components/notices/notices-sidebar";
import { NoticesTypeTabs } from "@/components/notices/notices-type-tabs";
import { useEvents, useNotices } from "@/hooks/use-data";
import { sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function NoticesPage() {
  const notices = useNotices();
  const events = useEvents();
  const [active, setActive] = useState("All");

  const types = useMemo(
    () => ["All", ...Array.from(new Set((notices.data ?? []).map((notice) => notice.type)))],
    [notices.data],
  );

  const filtered = useMemo(() => {
    const list = notices.data ?? [];
    return list
      .filter((notice) => active === "All" || notice.type === active)
      .sort(
        (a, b) =>
          Number(b.pinned) - Number(a.pinned) ||
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
  }, [notices.data, active]);

  return (
    <main id="main">
      <NoticesHero />
      <NoticesTypeTabs types={types} active={active} onSelect={setActive} />

      <section className={cn(sectionClass, "pt-4")}>
        <div className={cn(shellClass, "grid gap-4 lg:grid-cols-[1.6fr_1fr] items-start")}>
          <NoticesList
            notices={filtered}
            isLoading={notices.isLoading}
            activeType={active}
          />
          <NoticesSidebar events={events.data ?? []} />
        </div>
      </section>
    </main>
  );
}
