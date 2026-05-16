"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUserId } from "@/lib/supabase/current-user";
import type { ChecklistItem } from "@/types";

interface ChecklistRow {
  id: string;
  timeline: string;
  title: string;
  is_completed: boolean | null;
}

export function useChecklist() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const uid = await getCurrentUserId(supabase);
        if (!uid) { setLoading(false); return; }

        const { data, error } = await supabase.from("checklist_items").select("*").eq("user_id", uid).order("sort_order");
        if (error) console.error("useChecklist load error:", error);
        if (data && data.length > 0) {
          setChecklist((data as ChecklistRow[]).map((c) => ({
            id: c.id,
            timeline: c.timeline,
            title: c.title,
            done: c.is_completed || false,
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
    try {
      const supabase = createClient();
      const { error } = await supabase.from("checklist_items").update({ is_completed: !item.done }).eq("id", id);
      if (error) console.error("toggleItem error:", error);
    } catch (e) { console.error("toggleItem exception:", e); }
  }, [checklist]);

  return { checklist, loading, toggleItem };
}
