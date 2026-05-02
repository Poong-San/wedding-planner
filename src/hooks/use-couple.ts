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
        if (data && data.bride_name) {
          setCouple({
            bride: data.bride_name || "",
            groom: data.groom_name || "",
            weddingDate: data.wedding_date || "2026-06-14",
            message: data.couple_message || "",
          });
        }
      } catch { /* fallback to mock */ }
      setLoading(false);
    }
    load();
  }, []);

  const updateMessage = async (message: string) => {
    setCouple((prev) => ({ ...prev, message }));
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ couple_message: message }).eq("id", user.id);
      }
    } catch { /* ignore */ }
  };

  return { couple, loading, updateMessage };
}
