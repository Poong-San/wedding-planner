"use client";

import { ChevLeftIcon, ChevRightIcon } from "@/components/ui/icons";
import type { CalendarEvent } from "@/types";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface MonthGridProps {
  year: number;
  month: number;
  selectedDate: string;
  events: CalendarEvent[];
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MonthGrid({
  year, month, selectedDate, events,
  onSelectDate, onPrevMonth, onNextMonth,
}: MonthGridProps) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const prevLastDate = new Date(year, month - 1, 0).getDate();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const cells: { d: number; muted: boolean; fullDate?: string }[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ d: prevLastDate - firstDay + i + 1, muted: true });
  }
  for (let d = 1; d <= lastDate; d++) {
    cells.push({
      d,
      muted: false,
      fullDate: `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ d: cells.length - lastDate - firstDay + 1, muted: true });
  }

  const eventDates = new Set(events.map((e) => e.date));

  return (
    <div className="px-5 pb-4">
      <div className="flex justify-between items-center mb-3.5">
        <button onClick={onPrevMonth} className="w-9 h-9 flex items-center justify-center bg-transparent border-none cursor-pointer">
          <ChevLeftIcon width={18} height={18} />
        </button>
        <span className="text-lg font-bold">{year}년 {month}월</span>
        <button onClick={onNextMonth} className="w-9 h-9 flex items-center justify-center bg-transparent border-none cursor-pointer">
          <ChevRightIcon width={18} height={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1.5">
        {DAYS.map((d, i) => (
          <div key={d} className={`text-center text-[11px] font-semibold pb-1.5 ${
            i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-ink-500"
          }`}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((c, i) => {
          const isToday = c.fullDate === todayStr;
          const isSelected = c.fullDate === selectedDate;
          const hasEvent = !c.muted && c.fullDate && eventDates.has(c.fullDate);

          return (
            <div
              key={i}
              onClick={() => !c.muted && c.fullDate && onSelectDate(c.fullDate)}
              className={`aspect-square flex flex-col items-center justify-center text-[13px] rounded-lg relative ${
                c.muted ? "text-ink-300 cursor-default" : "text-ink-700 cursor-pointer"
              } ${isToday ? "bg-green-500 text-white font-bold" : ""} ${
                isSelected && !isToday ? "bg-green-100 font-bold" : ""
              }`}
            >
              {c.d}
              {hasEvent && (
                <span className={`absolute bottom-1.5 w-1 h-1 rounded-full ${
                  isToday ? "bg-white" : "bg-green-500"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
