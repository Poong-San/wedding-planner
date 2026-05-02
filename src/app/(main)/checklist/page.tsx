"use client";

import { PlusIcon } from "@/components/ui/icons";
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
      <div className="px-5 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold m-0">체크리스트</h1>
        <button className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center border-none cursor-pointer">
          <PlusIcon width={18} height={18} />
        </button>
      </div>

      <ChecklistProgressCard done={done} total={total} />

      <div className="px-5">
        {TIMELINE_ORDER.filter((t) => groups[t]).map((t) => (
          <TimelineGroup key={t} timeline={t} items={groups[t]} onToggle={toggleItem} />
        ))}
      </div>
    </>
  );
}
