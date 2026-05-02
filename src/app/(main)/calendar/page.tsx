"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { MonthGrid } from "@/components/calendar/month-grid";
import { EventList } from "@/components/calendar/event-list";
import { EventDetailModal } from "@/components/modals/event-detail-modal";
import { AddEventModal } from "@/components/modals/add-event-modal";
import { useEvents } from "@/hooks/use-events";

export default function CalendarPage() {
  const { events, addEvent, deleteEvent } = useEvents();
  const [viewMonth, setViewMonth] = useState({ y: 2026, m: 5 });
  const [selectedDate, setSelectedDate] = useState("2026-05-04");
  const [detailEvent, setDetailEvent] = useState<number | string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const selectedEvents = events.filter((e) => e.date === selectedDate);
  const detail = detailEvent ? events.find((e) => e.id === detailEvent) : null;

  const prevMonth = () =>
    setViewMonth((v) => (v.m === 1 ? { y: v.y - 1, m: 12 } : { y: v.y, m: v.m - 1 }));
  const nextMonth = () =>
    setViewMonth((v) => (v.m === 12 ? { y: v.y + 1, m: 1 } : { y: v.y, m: v.m + 1 }));

  return (
    <>
      <div className="px-5 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold m-0">캘린더</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center border-none cursor-pointer"
        >
          <PlusIcon width={18} height={18} />
        </button>
      </div>

      <MonthGrid
        year={viewMonth.y} month={viewMonth.m}
        selectedDate={selectedDate} events={events}
        onSelectDate={setSelectedDate}
        onPrevMonth={prevMonth} onNextMonth={nextMonth}
      />

      <div className="mx-5 mb-4 h-px bg-ink-200" />

      <EventList
        date={selectedDate} events={selectedEvents}
        onEventClick={(id) => setDetailEvent(id)}
      />

      {detail && (
        <EventDetailModal
          event={detail}
          onClose={() => setDetailEvent(null)}
          onDelete={(id) => { deleteEvent(id); setDetailEvent(null); }}
        />
      )}
      {showAdd && (
        <AddEventModal
          date={selectedDate}
          onClose={() => setShowAdd(false)}
          onAdd={(event) => addEvent(event)}
        />
      )}
    </>
  );
}
