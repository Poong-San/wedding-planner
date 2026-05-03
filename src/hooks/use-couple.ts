"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_COUPLE } from "@/lib/mock-data";
import type { CoupleInfo } from "@/types";

export function useCouple() {
  const [couple, setCouple] = useState<CoupleInfo>(MOCK_COUPLE);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setIsGuest(true); setLoading(false); return; }
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (data) {
          setCouple({
            bride: data.bride_name || "",
            groom: data.groom_name || "",
            weddingDate: data.wedding_date || "",
            message: data.couple_message || "",
          });
        }
      } catch (e) {
        console.error("useCouple load error:", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  const updateCouple = async (updates: Partial<CoupleInfo>) => {
    setCouple((prev) => ({ ...prev, ...updates }));
    if (isGuest) return;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const dbUpdates: Record<string, string> = {};
        if (updates.bride !== undefined) dbUpdates.bride_name = updates.bride;
        if (updates.groom !== undefined) dbUpdates.groom_name = updates.groom;
        if (updates.weddingDate !== undefined) dbUpdates.wedding_date = updates.weddingDate;
        if (updates.message !== undefined) dbUpdates.couple_message = updates.message;
        const { error } = await supabase.from("profiles").update(dbUpdates).eq("id", user.id);
        if (error) console.error("updateCouple error:", error);
      }
    } catch (e) {
      console.error("updateCouple exception:", e);
    }
  };

  const updateMessage = (message: string) => updateCouple({ message });

  return { couple, loading, updateCouple, updateMessage };
}
