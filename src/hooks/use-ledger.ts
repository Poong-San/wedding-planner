"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CategoryType } from "@/types";

export interface LedgerEntry {
  id: string;
  categoryType: CategoryType | null;
  title: string;
  amount: number;
  date: string;
  memo: string;
}

export function useLedger() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: profile } = await supabase.from("profiles").select("id").limit(1).maybeSingle();
        const uid = profile?.id;
        if (!uid) { setLoading(false); return; }
        setUserId(uid);

        const { data, error } = await supabase
          .from("ledger")
          .select("*")
          .eq("user_id", uid)
          .order("date", { ascending: false });
        if (error) console.error("useLedger error:", error);
        if (data) {
          setEntries(data.map((e: any) => ({
            id: e.id,
            categoryType: e.category_type as CategoryType | null,
            title: e.title,
            amount: e.amount,
            date: e.date,
            memo: e.memo || "",
          })));
        }
      } catch (e) { console.error("useLedger exception:", e); }
      setLoading(false);
    }
    load();
  }, []);

  const addEntry = useCallback(async (entry: Omit<LedgerEntry, "id">) => {
    if (!userId) return;
    const tempId = crypto.randomUUID();
    setEntries((prev) => [{ ...entry, id: tempId }, ...prev]);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("ledger").insert({
        user_id: userId,
        category_type: entry.categoryType,
        title: entry.title,
        amount: entry.amount,
        date: entry.date,
        memo: entry.memo,
      }).select().single();
      if (error) console.error("addEntry error:", error);
      if (data) {
        setEntries((prev) => prev.map((e) => e.id === tempId ? { ...e, id: data.id } : e));
      }
    } catch (e) { console.error("addEntry exception:", e); }
  }, [userId]);

  const deleteEntry = useCallback(async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    try {
      const supabase = createClient();
      const { error } = await supabase.from("ledger").delete().eq("id", id);
      if (error) console.error("deleteEntry error:", error);
    } catch (e) { console.error("deleteEntry exception:", e); }
  }, []);

  return { entries, loading, addEntry, deleteEntry };
}
