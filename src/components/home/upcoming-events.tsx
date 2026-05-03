"use client";

import { useRouter } from "next/navigation";
import { CATEGORY_LABELS } from "@/lib/constants";
import { parseDate, formatTime, daysUntil } from "@/lib/utils";
import type { CalendarEvent } from "@/types";

interface UpcomingEventsProps {
  events: CalendarEvent[];
  onEventClick?: (eventId: number | string) => void;
}

function getUrgencyStyle(date: string) {
  const days = daysUntil(date);
  if (days <= 3) return { border: "border-red-200", bg: "bg-red-50", dateColor: "text-red-600", dot: "bg-red-500" };
  if (days <= 7) return { border: "border-orange-200", bg: "bg-orange-50", dateColor: "text-orange-600", dot: "bg-orange-400" };
  if (days <= 14) return { border: "border-yellow-200", bg: "bg-yellow-50", dateColor: "text-yellow-700", dot: "bg-yellow-400" };
  return { border: "border-green-200", bg: "bg-green-50/50", dateColor: "text-green-700", dot: "bg-green-400" };
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
        {events.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-ink-400">
            예정된 일정이 없어요
          </div>
        ) : (
          events.map((e) => {
            const { month, day } = parseDate(e.date);
            const urgency = getUrgencyStyle(e.date);
            return (
              <div
                key={e.id}
                className={`rounded-xl border p-3.5 flex items-center gap-3.5 cursor-pointer ${urgency.border} ${urgency.bg}`}
                onClick={() => onEventClick?.(e.id)}
              >
                <div className="w-12 text-center pr-3.5 border-r border-ink-200/50">
                  <div className="text-[10px] text-ink-500">{month}월</div>
                  <div className={`text-lg font-bold ${urgency.dateColor}`}>{day}</div>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold mb-0.5 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${urgency.dot}`} />
                    {e.title}
                  </div>
                  <div className="text-[11px] text-ink-500">
                    {formatTime(e.time) || "시간 미정"} · {CATEGORY_LABELS[e.cat] || ""}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
