"use client";

import { useRouter } from "next/navigation";
import { CATEGORY_LABELS } from "@/lib/constants";
import { parseDate } from "@/lib/utils";
import type { CalendarEvent } from "@/types";

interface UpcomingEventsProps {
  events: CalendarEvent[];
  onEventClick?: (eventId: number | string) => void;
}

export function UpcomingEvents({ events, onEventClick }: UpcomingEventsProps) {
  const router = useRouter();

  return (
    <div className="px-4 pb-4">
      <h3 className="text-[15px] font-bold mb-2.5 flex items-center justify-between">
        다가오는 일정
        <span
          onClick={() => router.push("/calendar")}
          className="text-xs text-green-600 font-medium cursor-pointer"
        >
          전체보기 →
        </span>
      </h3>
      <div className="flex flex-col gap-2">
        {events.map((e) => {
          const { month, day } = parseDate(e.date);
          return (
            <div
              key={e.id}
              className="card flex items-center gap-3.5 p-3.5 cursor-pointer"
              onClick={() => onEventClick?.(e.id)}
            >
              <div className="w-12 text-center border-r border-ink-200 pr-3.5">
                <div className="text-[10px] text-ink-500">{month}월</div>
                <div className="text-lg font-bold text-green-700">{day}</div>
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold mb-0.5">{e.title}</div>
                <div className="text-[11px] text-ink-500">
                  {e.time || "시간 미정"} · {CATEGORY_LABELS[e.cat] || ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
