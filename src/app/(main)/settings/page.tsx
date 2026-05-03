"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Field } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "", bride_name: "", groom_name: "",
    wedding_date: "", couple_message: "",
  });
  const [profileId, setProfileId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("profiles").select("*").limit(1).maybeSingle();
      if (data) {
        setProfileId(data.id);
        setProfile({
          name: data.name || "",
          bride_name: data.bride_name || "",
          groom_name: data.groom_name || "",
          wedding_date: data.wedding_date || "",
          couple_message: data.couple_message || "",
        });
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!profileId) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update(profile).eq("id", profileId);
    setSaving(false);
  };

  return (
    <>
      <PageHeader title="설정" onBack={false} />
      <div className="px-5 pb-6 flex flex-col gap-4">
        <Field label="이름">
          <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
        </Field>
        <Field label="신부 이름">
          <input value={profile.bride_name} onChange={(e) => setProfile({ ...profile, bride_name: e.target.value })}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
        </Field>
        <Field label="신랑 이름">
          <input value={profile.groom_name} onChange={(e) => setProfile({ ...profile, groom_name: e.target.value })}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
        </Field>
        <Field label="결혼식 날짜">
          <input type="date" value={profile.wedding_date}
            onChange={(e) => setProfile({ ...profile, wedding_date: e.target.value })}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
        </Field>
        <Field label="커플 메시지">
          <input value={profile.couple_message}
            onChange={(e) => setProfile({ ...profile, couple_message: e.target.value })}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
        </Field>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full mt-2 disabled:opacity-50">
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>
    </>
  );
}
