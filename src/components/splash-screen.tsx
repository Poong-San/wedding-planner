"use client";

import { useState, useEffect } from "react";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFade(true), 1200);
    const timer2 = setTimeout(() => setShow(false), 1700);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <>
      {show && (
        <div
          className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        >
          <img src="/icons/logo.png" alt="숲인" className="w-24 h-24 object-contain mb-4" />
          <h1 className="text-2xl font-bold tracking-tight">숲인</h1>
          <p className="text-sm text-ink-400 mt-1">결혼 준비를 함께</p>
        </div>
      )}
      {children}
    </>
  );
}
