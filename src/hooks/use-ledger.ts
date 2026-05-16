"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSharedDataProfileId } from "@/lib/supabase/current-user";

export type LedgerOwner = "groom" | "bride" | "shared";
export type LedgerType = "income" | "expense" | "transfer";

export interface LedgerEntry {
  id: string;
  categoryType: string | null;
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

interface LedgerRow {
  id: string;
  category_type: string | null;
  title: string;
  amount: number;
  date: string;
  memo: string | null;
  owner: LedgerOwner | null;
  type: LedgerType | null;
  is_recurring: boolean | null;
  recurring_day: number | null;
  payment_method: string | null;
  is_planned: boolean | null;
}

export function useLedger() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const uid = await getSharedDataProfileId(supabase);
        if (!uid) {
          setErrorMessage("로그인 정보를 확인하지 못했어요.");
          setLoading(false);
          return;
        }
        setUserId(uid);

        const { data, error } = await supabase
          .from("ledger")
          .select("*")
          .eq("user_id", uid)
          .order("date", { ascending: false });
        if (error) {
          setErrorMessage("가계부 데이터를 불러오지 못했어요.");
          console.error("useLedger error:", error);
        }
        if (data) {
          setEntries((data as LedgerRow[]).map((e) => ({
            id: e.id,
            categoryType: e.category_type,
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

  const addEntry = useCallback(async (entry: Omit<LedgerEntry, "id">): Promise<boolean> => {
    setErrorMessage("");
    const supabase = createClient();
    const targetUserId = userId || await getSharedDataProfileId(supabase);
    if (!targetUserId) {
      setErrorMessage("로그인 정보를 확인하지 못했어요. 다시 로그인해 주세요.");
      return false;
    }
    if (!userId) setUserId(targetUserId);

    const tempId = crypto.randomUUID();
    setEntries((prev) => [{ ...entry, id: tempId }, ...prev]);
    try {
      const { data, error } = await supabase.from("ledger").insert({
        user_id: targetUserId,
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
      if (error) {
        setEntries((prev) => prev.filter((e) => e.id !== tempId));
        setErrorMessage("가계부 저장에 실패했어요. Supabase 테이블과 RLS 정책을 확인해 주세요.");
        console.error("addEntry error:", error);
        return false;
      }
      if (data) {
        setEntries((prev) => prev.map((e) => e.id === tempId ? { ...e, id: data.id } : e));
      }
      return true;
    } catch (e) {
      setEntries((prev) => prev.filter((entryItem) => entryItem.id !== tempId));
      setErrorMessage("가계부 저장 중 오류가 발생했어요.");
      console.error("addEntry exception:", e);
      return false;
    }
  }, [userId]);

  const deleteEntry = useCallback(async (id: string) => {
    const previous = entries;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    try {
      const supabase = createClient();
      const { error } = await supabase.from("ledger").delete().eq("id", id);
      if (error) {
        setEntries(previous);
        setErrorMessage("가계부 삭제에 실패했어요.");
        console.error("deleteEntry error:", error);
      }
    } catch (e) {
      setEntries(previous);
      setErrorMessage("가계부 삭제 중 오류가 발생했어요.");
      console.error("deleteEntry exception:", e);
    }
  }, [entries]);

  return { entries, loading, errorMessage, addEntry, deleteEntry };
}

export const OWNER_COLORS: Record<LedgerOwner, { text: string; bg: string; border: string; dot: string }> = {
  groom: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500" },
  bride: { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500" },
  shared: { text: "text-green-600", bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500" },
};
