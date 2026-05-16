"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ensureCurrentUserProfile } from "@/lib/supabase/current-user";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unauthorized = searchParams.get("error") === "unauthorized";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(unauthorized ? "허용된 계정만 로그인할 수 있어요." : "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (unauthorized) {
      const supabase = createClient();
      supabase.auth.signOut();
    }
  }, [unauthorized]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setSubmitting(false);

    if (signInError) {
      setError("계정 또는 비밀번호를 확인해 주세요.");
      return;
    }

    if (data.user) await ensureCurrentUserProfile(supabase, data.user);

    router.replace("/");
    router.refresh();
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 bg-white">
      <div className="flex flex-col items-center mb-12">
        <img src="/icons/logo.png" alt="숲인" className="w-20 h-20 object-contain mb-4" />
        <h1 className="text-2xl font-bold tracking-tight">숲인</h1>
        <p className="text-sm text-ink-500 mt-1">결혼 준비를 함께 관리해요</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-ink-600">이메일</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className="w-full px-4 py-3 border border-ink-200 rounded-xl text-[14px] outline-none focus:border-green-500 font-sans"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-ink-600">비밀번호</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className="w-full px-4 py-3 border border-ink-200 rounded-xl text-[14px] outline-none focus:border-green-500 font-sans"
          />
        </label>

        {error && <div className="text-[12px] text-red-500 text-center">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 px-5 py-3.5 bg-green-600 text-white rounded-xl text-[14px] font-semibold cursor-pointer disabled:opacity-60 border-none font-sans"
        >
          {submitting ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
