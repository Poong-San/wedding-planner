"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_EVENTS } from "@/lib/mock-data";
import type { CalendarEvent, CategoryType } from "@/types";

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        const { data } = await supabase.from("events").select("*").eq("user_id", user.id).order("date");
        if (data && data.length > 0) {
          setEvents(data.map((e: any) => ({
            id: e.id,
            date: e.date,
            time: e.time,
            title: e.title,
            cat: e.category_type as CategoryType,
          })));
        }
      } catch { /* fallback to mock */ }
      setLoading(false);
    }
    load();
  }, []);

  const addEvent = useCallback(async (event: Omit<CalendarEvent, "id">) => {
    const tempId = Date.now();
    setEvents((prev) => [...prev, { ...event, id: tempId }]);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("events").insert({
          user_id: user.id,
          title: event.title,
          date: event.date,
          time: event.time,
          category_type: event.cat,
        }).select().single();
        if (data) {
          setEvents((prev) => prev.map((e) => e.id === tempId ? { ...e, id: data.id } : e));
        }
      }
    } catch { /* local state already updated */ }
  }, []);

  const deleteEvent = useCallback(async (id: number | string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    try {
      const supabase = createClient();
      await supabase.from("events").delete().eq("id", id);
    } catch { /* ignore */ }
  }, []);

  return { events, loading, addEvent, deleteEvent };
}
