"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

async function seedInitialData(supabase: any, userId: string) {
  const categoryTypes = [
    { type: "wedding_hall", name: "웨딩홀" },
    { type: "sdm", name: "스드메" },
    { type: "home_goods", name: "혼수" },
    { type: "ceremony", name: "본식" },
    { type: "honeymoon", name: "허니문" },
    { type: "jewelry", name: "예물" },
    { type: "yedan", name: "예단" },
    { type: "invitation", name: "청첩장" },
    { type: "newhome", name: "신혼집" },
  ];

  await supabase.from("categories").insert(
    categoryTypes.map((c) => ({ user_id: userId, type: c.type, name: c.name, status: "pending" }))
  );

  await supabase.from("budgets").insert({ user_id: userId, total_budget: 0 });

  const defaultChecklist = [
    { timeline: "6개월 전", title: "웨딩홀 예약", sort_order: 1 },
    { timeline: "6개월 전", title: "스드메 상담", sort_order: 2 },
    { timeline: "6개월 전", title: "예산 계획 수립", sort_order: 3 },
    { timeline: "3개월 전", title: "청첩장 주문", sort_order: 4 },
    { timeline: "3개월 전", title: "허니문 예약", sort_order: 5 },
    { timeline: "3개월 전", title: "혼수 구매 시작", sort_order: 6 },
    { timeline: "3개월 전", title: "예단 준비", sort_order: 7 },
    { timeline: "1개월 전", title: "청첩장 발송", sort_order: 8 },
    { timeline: "1개월 전", title: "드레스 최종 피팅", sort_order: 9 },
    { timeline: "1개월 전", title: "식순 확정", sort_order: 10 },
    { timeline: "1주 전", title: "최종 인원 확인", sort_order: 11 },
    { timeline: "1주 전", title: "축의금 봉투 준비", sort_order: 12 },
  ];

  await supabase.from("checklist_items").insert(
    defaultChecklist.map((c) => ({ user_id: userId, ...c }))
  );
}

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
      await seedInitialData(supabase, data.user.id);
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
