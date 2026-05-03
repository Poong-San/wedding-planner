"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_BUDGET } from "@/lib/mock-data";
import type { Budget } from "@/types";

export function useBudget() {
  const [budget, setBudget] = useState<Budget>(MOCK_BUDGET);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: profile } = await supabase.from("profiles").select("id").limit(1).maybeSingle();
        const uid = profile?.id;
        if (!uid) { setLoading(false); return; }

        const { data, error } = await supabase.from("budgets").select("*").eq("user_id", uid).maybeSingle();
        if (error && error.code !== "PGRST116") console.error("useBudget load error:", error);
        if (data) {
          setBudget({ total: data.total_budget || 0 });
        }
      } catch (e) { console.error("useBudget exception:", e); }
      setLoading(false);
    }
    load();
  }, []);

  return { budget, loading };
}
