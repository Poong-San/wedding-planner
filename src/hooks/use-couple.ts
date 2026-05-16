"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSharedDataProfileId } from "@/lib/supabase/current-user";
import { uploadImage } from "@/lib/upload";
import type { CoupleInfo } from "@/types";

export function useCouple() {
  const [couple, setCouple] = useState<CoupleInfo>({ bride: "", groom: "", weddingDate: "", message: "" });
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const uid = await getSharedDataProfileId(supabase);
        if (!uid) { setLoading(false); return; }
        const { data } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
        if (data) {
          setProfileId(data.id);
          setCouple({
            bride: data.bride_name || "",
            groom: data.groom_name || "",
            weddingDate: data.wedding_date || "",
            message: data.couple_message || "",
          });
          if (data.couple_photo_url) setHeroImage(data.couple_photo_url);
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
    if (!profileId) return;
    try {
      const supabase = createClient();
      const dbUpdates: Record<string, string> = {};
      if (updates.bride !== undefined) dbUpdates.bride_name = updates.bride;
      if (updates.groom !== undefined) dbUpdates.groom_name = updates.groom;
      if (updates.weddingDate !== undefined) dbUpdates.wedding_date = updates.weddingDate;
      if (updates.message !== undefined) dbUpdates.couple_message = updates.message;
      const { error } = await supabase.from("profiles").update(dbUpdates).eq("id", profileId);
      if (error) console.error("updateCouple error:", error);
    } catch (e) {
      console.error("updateCouple exception:", e);
    }
  };

  const uploadHeroImage = useCallback(async (file: File) => {
    const url = await uploadImage(file, "hero");
    if (!url) return;
    setHeroImage(url);
    if (!profileId) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("profiles").update({ couple_photo_url: url }).eq("id", profileId);
      if (error) console.error("uploadHeroImage DB error:", error);
    } catch (e) {
      console.error("uploadHeroImage exception:", e);
    }
  }, [profileId]);

  const updateMessage = (message: string) => updateCouple({ message });

  return { couple, heroImage, loading, updateCouple, updateMessage, uploadHeroImage };
}
