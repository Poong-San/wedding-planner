"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_GUESTS } from "@/lib/mock-data";
import type { Guest } from "@/types";

export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
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

        const { data, error } = await supabase.from("guests").select("*").eq("user_id", uid).order("created_at");
        if (error) console.error("useGuests load error:", error);
        if (data) {
          setGuests(data.map((g: any) => ({
            id: g.id,
            name: g.name,
            side: g.side,
            rel: g.relationship,
            att: g.attendance,
            meal: g.meal,
            gift: g.gift_amount || 0,
          })));
        }
      } catch (e) { console.error("useGuests exception:", e); }
      setLoading(false);
    }
    load();
  }, []);

  const addGuest = useCallback(async (guest: Omit<Guest, "id">) => {
    const tempId = Date.now();
    setGuests((prev) => [...prev, { ...guest, id: tempId }]);
    if (!userId) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("guests").insert({
        user_id: userId, name: guest.name, side: guest.side,
        relationship: guest.rel, attendance: guest.att,
        meal: guest.meal, gift_amount: guest.gift,
      }).select().single();
      if (error) console.error("addGuest error:", error);
      if (data) {
        setGuests((prev) => prev.map((g) => g.id === tempId ? { ...g, id: data.id } : g));
      }
    } catch (e) { console.error("addGuest exception:", e); }
  }, [userId]);

  const updateGuest = useCallback(async (id: number | string, changes: Partial<Guest>) => {
    setGuests((prev) => prev.map((g) => g.id === id ? { ...g, ...changes } : g));
    try {
      const supabase = createClient();
      const updateData: Record<string, unknown> = {};
      if (changes.name !== undefined) updateData.name = changes.name;
      if (changes.side !== undefined) updateData.side = changes.side;
      if (changes.rel !== undefined) updateData.relationship = changes.rel;
      if (changes.att !== undefined) updateData.attendance = changes.att;
      if (changes.meal !== undefined) updateData.meal = changes.meal;
      if (changes.gift !== undefined) updateData.gift_amount = changes.gift;
      const { error } = await supabase.from("guests").update(updateData).eq("id", id);
      if (error) console.error("updateGuest error:", error);
    } catch (e) { console.error("updateGuest exception:", e); }
  }, []);

  const deleteGuest = useCallback(async (id: number | string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
    try {
      const supabase = createClient();
      const { error } = await supabase.from("guests").delete().eq("id", id);
      if (error) console.error("deleteGuest error:", error);
    } catch (e) { console.error("deleteGuest exception:", e); }
  }, []);

  return { guests, loading, addGuest, updateGuest, deleteGuest };
}
