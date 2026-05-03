"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_COUPLE } from "@/lib/mock-data";
import type { CoupleInfo } from "@/types";

export function useCouple() {
  const [couple, setCouple] = useState<CoupleInfo>(MOCK_COUPLE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (data) {
          setCouple({
            bride: data.bride_name || MOCK_COUPLE.bride,
            groom: data.groom_name || MOCK_COUPLE.groom,
            weddingDate: data.wedding_date || MOCK_COUPLE.weddingDate,
            message: data.couple_message || MOCK_COUPLE.message,
          });
        }
      } catch { /* fallback to mock */ }
      setLoading(false);
    }
    load();
  }, []);

  const updateCouple = async (updates: Partial<CoupleInfo>) => {
    setCouple((prev) => ({ ...prev, ...updates }));
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const dbUpdates: Record<string, string> = {};
        if (updates.bride !== undefined) dbUpdates.bride_name = updates.bride;
        if (updates.groom !== undefined) dbUpdates.groom_name = updates.groom;
        if (updates.weddingDate !== undefined) dbUpdates.wedding_date = updates.weddingDate;
        if (updates.message !== undefined) dbUpdates.couple_message = updates.message;
        await supabase.from("profiles").update(dbUpdates).eq("id", user.id);
      }
    } catch { /* ignore */ }
  };

  // Keep backward compat
  const updateMessage = (message: string) => updateCouple({ message });

  return { couple, loading, updateCouple, updateMessage };
}
