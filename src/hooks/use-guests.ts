"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_GUESTS } from "@/lib/mock-data";
import type { Guest } from "@/types";

export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        const { data } = await supabase.from("guests").select("*").eq("user_id", user.id).order("created_at");
        if (data && data.length > 0) {
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
      } catch { /* fallback to mock */ }
      setLoading(false);
    }
    load();
  }, []);

  const addGuest = useCallback(async (guest: Omit<Guest, "id">) => {
    const tempId = Date.now();
    setGuests((prev) => [...prev, { ...guest, id: tempId }]);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("guests").insert({
          user_id: user.id, name: guest.name, side: guest.side,
          relationship: guest.rel, attendance: guest.att,
          meal: guest.meal, gift_amount: guest.gift,
        }).select().single();
        if (data) {
          setGuests((prev) => prev.map((g) => g.id === tempId ? { ...g, id: data.id } : g));
        }
      }
    } catch { /* ignore */ }
  }, []);

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
      await supabase.from("guests").update(updateData).eq("id", id);
    } catch { /* ignore */ }
  }, []);

  const deleteGuest = useCallback(async (id: number | string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
    try {
      const supabase = createClient();
      await supabase.from("guests").delete().eq("id", id);
    } catch { /* ignore */ }
  }, []);

  return { guests, loading, addGuest, updateGuest, deleteGuest };
}
