"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_CHECKLIST } from "@/lib/mock-data";
import type { ChecklistItem } from "@/types";

export function useChecklist() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(MOCK_CHECKLIST);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsGuest(true); setLoading(false); return; }
        const { data, error } = await supabase.from("checklist_items").select("*").eq("user_id", user.id).order("sort_order");
        if (error) console.error("useChecklist load error:", error);
        if (data && data.length > 0) {
          setChecklist(data.map((c: any) => ({
            id: c.id,
            timeline: c.timeline,
            title: c.title,
            done: c.is_completed,
          })));
        }
      } catch (e) { console.error("useChecklist exception:", e); }
      setLoading(false);
    }
    load();
  }, []);

  const toggleItem = useCallback(async (id: number | string) => {
    const item = checklist.find((c) => c.id === id);
    if (!item) return;
    setChecklist((prev) => prev.map((c) => c.id === id ? { ...c, done: !c.done } : c));
    if (isGuest) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("checklist_items").update({ is_completed: !item.done }).eq("id", id);
      if (error) console.error("toggleItem error:", error);
    } catch (e) { console.error("toggleItem exception:", e); }
  }, [checklist, isGuest]);

  return { checklist, loading, toggleItem };
}
