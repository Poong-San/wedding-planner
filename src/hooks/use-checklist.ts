"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_CHECKLIST } from "@/lib/mock-data";
import type { ChecklistItem } from "@/types";

export function useChecklist() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(MOCK_CHECKLIST);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        const { data } = await supabase.from("checklist_items").select("*").eq("user_id", user.id).order("sort_order");
        if (data && data.length > 0) {
          setChecklist(data.map((c: any) => ({
            id: c.id,
            timeline: c.timeline,
            title: c.title,
            done: c.is_completed,
          })));
        }
      } catch { /* fallback to mock */ }
      setLoading(false);
    }
    load();
  }, []);

  const toggleItem = useCallback(async (id: number | string) => {
    const item = checklist.find((c) => c.id === id);
    if (!item) return;
    setChecklist((prev) => prev.map((c) => c.id === id ? { ...c, done: !c.done } : c));
    try {
      const supabase = createClient();
      await supabase.from("checklist_items").update({ is_completed: !item.done }).eq("id", id);
    } catch { /* ignore */ }
  }, [checklist]);

  return { checklist, loading, toggleItem };
}
