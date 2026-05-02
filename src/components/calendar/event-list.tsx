import { CATEGORY_LABELS } from "@/lib/constants";
import type { CalendarEvent } from "@/types";

interface EventListProps {
  date: string;
  events: CalendarEvent[];
  onEventClick?: (eventId: number | string) => void;
}

export function EventList({ date, events, onEventClick }: EventListProps) {
  const month = date.slice(5, 7);
  const day = date.slice(8);

  return (
    <div className="px-5 pb-4">
      <div className="text-[11px] text-ink-500 uppercase tracking-wider font-medium mb-3">
        {month}월 {day}일 일정 {events.length}건
      </div>
      {events.length === 0 ? (
        <div className="py-[30px] text-center text-xs text-ink-400">
          이 날 일정이 없어요
        </div>
      ) : (
        events.map((e) => (
          <div
            key={e.id}
            className="flex gap-3 mb-2.5 p-3 bg-white border border-ink-200 rounded-xl cursor-pointer"
            onClick={() => onEventClick?.(e.id)}
          >
            <div className="w-[3px] bg-green-500 rounded-sm" />
            <div className="flex-1">
              <div className="text-[13px] font-semibold">{e.title}</div>
              <div className="text-[11px] text-ink-500 mt-0.5">
                {e.time || "시간 미정"} · {CATEGORY_LABELS[e.cat] || ""}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
