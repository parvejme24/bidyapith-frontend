"use client";

import { EmptyState } from "@/components/site/empty-state";
import { NoticeRow } from "@/components/site/notice-row";
import { NoticeRowSkeleton } from "@/components/site/skeletons";
import type { Notice } from "@/lib/types";

interface NoticesListProps {
  notices: Notice[];
  isLoading: boolean;
  activeType: string;
}

export function NoticesList({ notices, isLoading, activeType }: NoticesListProps) {
  return (
    <div className="space-y-3">
      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <NoticeRowSkeleton key={i} />
        ))
      ) : notices.length ? (
        notices.map((notice) => <NoticeRow key={notice.id} notice={notice} />)
      ) : (
        <EmptyState
          title={`Nothing filed under ${activeType}`}
          description="Check back after the next academic council meeting."
        />
      )}
    </div>
  );
}
