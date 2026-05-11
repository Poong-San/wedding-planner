"use client";

import { PlusIcon } from "@/components/ui/icons";
import { PageHeaderWithMenu } from "@/components/layout/page-header-with-menu";
import { ChecklistProgressCard } from "@/components/checklist/progress-card";
import { TimelineGroup } from "@/components/checklist/timeline-group";
import { useChecklist } from "@/hooks/use-checklist";

const TIMELINE_ORDER = ["6개월 전", "3개월 전", "1개월 전", "1주 전"];

export default function ChecklistPage() {
  const { checklist, toggleItem } = useChecklist();
  const total = checklist.length;
  const done = checklist.filter((c) => c.done).length;

  const groups: Record<string, typeof checklist> = {};
  checklist.forEach((c) => {
    if (!groups[c.timeline]) groups[c.timeline] = [];
    groups[c.timeline].push(c);
  });

  return (
    <>
      <PageHeaderWithMenu
        title="체크리스트"
        right={
          <button className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center border-none cursor-pointer">
            <PlusIcon width={18} height={18} />
          </button>
        }
      />

      <ChecklistProgressCard done={done} total={total} />

      <div className="px-5">
        {TIMELINE_ORDER.filter((t) => groups[t]).map((t) => (
          <TimelineGroup key={t} timeline={t} items={groups[t]} onToggle={toggleItem} />
        ))}
      </div>
    </>
  );
}
