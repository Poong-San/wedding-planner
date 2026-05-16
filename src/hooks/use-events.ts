"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUserId } from "@/lib/supabase/current-user";
import type { CalendarEvent, CategoryType } from "@/types";

interface EventRow {
  id: string;
  date: string;
  time: string | null;
  title: string;
  category_type: CategoryType | null;
}

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const uid = await getCurrentUserId(supabase);
        if (!uid) { setLoading(false); return; }
        setUserId(uid);

        const { data, error } = await supabase.from("events").select("*").eq("user_id", uid).order("date");
        if (error) console.error("useEvents load error:", error);
        if (data) {
          setEvents((data as EventRow[]).map((e) => ({
            id: e.id,
            date: e.date,
            time: e.time,
            title: e.title,
            cat: e.category_type || "wedding_hall",
          })));
        }
      } catch (e) { console.error("useEvents exception:", e); }
      setLoading(false);
    }
    load();
  }, []);

  const addEvent = useCallback(async (event: Omit<CalendarEvent, "id">) => {
    const tempId = Date.now();
    setEvents((prev) => [...prev, { ...event, id: tempId }]);
    if (!userId) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("events").insert({
        user_id: userId,
        title: event.title,
        date: event.date,
        time: event.time,
        category_type: event.cat,
      }).select().single();
      if (error) console.error("addEvent error:", error);
      if (data) {
        setEvents((prev) => prev.map((e) => e.id === tempId ? { ...e, id: data.id } : e));
      }
    } catch (e) { console.error("addEvent exception:", e); }
  }, [userId]);

  const deleteEvent = useCallback(async (id: number | string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    try {
      const supabase = createClient();
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) console.error("deleteEvent error:", error);
    } catch (e) { console.error("deleteEvent exception:", e); }
  }, []);

  return { events, loading, addEvent, deleteEvent };
}
