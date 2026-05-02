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
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        const { data } = await supabase.from("budgets").select("*").eq("user_id", user.id).single();
        if (data) {
          setBudget({ total: data.total_budget || 0 });
        }
      } catch { /* fallback to mock */ }
      setLoading(false);
    }
    load();
  }, []);

  return { budget, loading };
}
