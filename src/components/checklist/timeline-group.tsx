"use client";

import { CheckIcon } from "@/components/ui/icons";
import type { ChecklistItem } from "@/types";

interface TimelineGroupProps {
  timeline: string;
  items: ChecklistItem[];
  onToggle?: (id: number) => void;
}

export function TimelineGroup({ timeline, items, onToggle }: TimelineGroupProps) {
  const doneCount = items.filter((i) => i.done).length;

  return (
    <div className="mb-[18px]">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[11px] font-semibold px-2.5 py-[3px] rounded-full bg-green-100 text-green-700">
          {timeline}
        </span>
        <span className="text-[11px] text-ink-500">{doneCount}/{items.length} 완료</span>
      </div>
      <div className="card p-0">
        {items.map((it, i) => (
          <div
            key={it.id}
            onClick={() => onToggle?.(it.id)}
            className={`px-3.5 py-3 flex items-center gap-3 cursor-pointer ${
              i < items.length - 1 ? "border-b border-ink-100" : ""
            }`}
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
              it.done ? "bg-green-500" : "border-[1.5px] border-ink-300"
            }`}>
              {it.done && <CheckIcon width={12} height={12} className="text-white" />}
            </div>
            <span className={`text-[13px] flex-1 ${
              it.done ? "text-ink-400 line-through" : "text-ink-900"
            }`}>
              {it.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
