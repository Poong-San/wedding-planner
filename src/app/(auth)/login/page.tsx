"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8">
      <div className="text-center mb-10">
        <div className="text-4xl mb-2">♡</div>
        <h1 className="text-2xl font-bold tracking-tight">우리의 결혼</h1>
        <p className="text-sm text-ink-500 mt-2">결혼 준비를 함께 관리해요</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        <input
          type="email" placeholder="이메일" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-ink-200 rounded-xl text-sm font-sans"
        />
        <input
          type="password" placeholder="비밀번호" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-ink-200 rounded-xl text-sm font-sans"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          onClick={handleLogin} disabled={loading}
          className="btn-primary w-full mt-2 disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </div>

      <p className="text-xs text-ink-500 mt-6">
        계정이 없으신가요?{" "}
        <span onClick={() => router.push("/signup")} className="text-green-600 font-medium cursor-pointer">
          회원가입
        </span>
      </p>
    </div>
  );
}
