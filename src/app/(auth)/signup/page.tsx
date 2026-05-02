"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        name,
      });
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8">
      <div className="text-center mb-10">
        <div className="text-4xl mb-2">♡</div>
        <h1 className="text-2xl font-bold tracking-tight">회원가입</h1>
        <p className="text-sm text-ink-500 mt-2">함께 결혼 준비를 시작해요</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        <input
          type="text" placeholder="이름" value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-ink-200 rounded-xl text-sm font-sans"
        />
        <input
          type="email" placeholder="이메일" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-ink-200 rounded-xl text-sm font-sans"
        />
        <input
          type="password" placeholder="비밀번호 (6자 이상)" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-ink-200 rounded-xl text-sm font-sans"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          onClick={handleSignup} disabled={loading}
          className="btn-primary w-full mt-2 disabled:opacity-50"
        >
          {loading ? "가입 중..." : "가입하기"}
        </button>
      </div>

      <p className="text-xs text-ink-500 mt-6">
        이미 계정이 있으신가요?{" "}
        <span onClick={() => router.push("/login")} className="text-green-600 font-medium cursor-pointer">
          로그인
        </span>
      </p>
    </div>
  );
}
