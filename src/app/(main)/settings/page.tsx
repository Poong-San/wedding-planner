"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Field } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "", bride_name: "", groom_name: "",
    wedding_date: "", couple_message: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
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
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update(profile).eq("id", user.id);
    setSaving(false);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
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

        <button onClick={handleLogout} className="btn-ghost w-full text-red-400 mt-4">
          로그아웃
        </button>
      </div>
    </>
  );
}
