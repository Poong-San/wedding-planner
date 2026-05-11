"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CategoryType } from "@/types";

export type LedgerOwner = "groom" | "bride" | "shared";
export type LedgerType = "income" | "expense" | "transfer";

export interface LedgerEntry {
  id: string;
  categoryType: CategoryType | null;
  title: string;
  amount: number;
  date: string;
  memo: string;
  owner: LedgerOwner;
  type: LedgerType;
  isRecurring: boolean;
  recurringDay: number | null;
  paymentMethod: string;
  isPlanned: boolean;
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
            owner: (e.owner || "shared") as LedgerOwner,
            type: (e.type || "expense") as LedgerType,
            isRecurring: e.is_recurring || false,
            recurringDay: e.recurring_day || null,
            paymentMethod: e.payment_method || "",
            isPlanned: e.is_planned || false,
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
        owner: entry.owner,
        type: entry.type,
        is_recurring: entry.isRecurring,
        recurring_day: entry.recurringDay,
        payment_method: entry.paymentMethod,
        is_planned: entry.isPlanned,
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

// 유틸리티
export const OWNER_LABELS: Record<LedgerOwner, string> = {
  groom: "민준 (신랑)",
  bride: "지영 (신부)",
  shared: "공동",
};

export const OWNER_SHORT: Record<LedgerOwner, string> = {
  groom: "신랑",
  bride: "신부",
  shared: "공동",
};

export const OWNER_COLORS: Record<LedgerOwner, { text: string; bg: string; border: string; dot: string }> = {
  groom: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500" },
  bride: { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500" },
  shared: { text: "text-green-600", bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500" },
};
