"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 bg-white">
      <div className="flex flex-col items-center mb-12">
        <img src="/icons/logo.png" alt="숲인" className="w-20 h-20 object-contain mb-4" />
        <h1 className="text-2xl font-bold tracking-tight">숲인</h1>
        <p className="text-sm text-ink-500 mt-1">결혼 준비를 함께 관리해요</p>
      </div>

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full max-w-xs flex items-center justify-center gap-3 px-5 py-3.5 bg-white border border-ink-200 rounded-xl text-[14px] font-medium text-ink-700 cursor-pointer shadow-sm hover:bg-ink-50 transition-colors font-sans"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
        </svg>
        Google로 로그인
      </button>
    </div>
  );
}
