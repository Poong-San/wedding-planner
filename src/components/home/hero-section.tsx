"use client";

import { useState } from "react";
import { daysUntil } from "@/lib/utils";
import type { CoupleInfo } from "@/types";

interface HeroSectionProps {
  couple: CoupleInfo;
  onUpdateMessage?: (message: string) => void;
}

export function HeroSection({ couple, onUpdateMessage }: HeroSectionProps) {
  const dday = daysUntil(couple.weddingDate);
  const [editing, setEditing] = useState(false);
  const [tempMsg, setTempMsg] = useState(couple.message);

  return (
    <div className="px-4">
      <div
        className="h-[280px] rounded-[20px] relative border border-green-200 overflow-hidden"
        style={{
          background: "repeating-linear-gradient(45deg, #f5e8e0, #f5e8e0 8px, #fdf9f3 8px, #fdf9f3 16px)",
        }}
      >
        <div className="absolute inset-0 rounded-[20px]"
          style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.45) 100%)" }}
        />
        <span className="absolute top-3.5 right-3.5 bg-white/85 px-2.5 py-1 rounded-full text-[11px] text-green-700 font-semibold">
          커플 사진 ↑
        </span>
        <div className="absolute bottom-[18px] left-[18px] right-[18px] text-white">
          <div className="text-[11px] opacity-90 mb-1 tracking-widest">
            {couple.weddingDate.replaceAll("-", " · ")}
          </div>
          <div className="text-xl font-bold mb-2 tracking-tight">
            {couple.bride} ♡ {couple.groom}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[48px] font-extrabold leading-none">D-{dday}</span>
            <span className="text-[13px] opacity-85">결혼식까지</span>
          </div>
        </div>
      </div>

      {!editing ? (
        <p
          onClick={() => { setTempMsg(couple.message); setEditing(true); }}
          className="text-center text-[13px] text-ink-500 my-3.5 italic cursor-pointer"
        >
          &ldquo;{couple.message}&rdquo; <span className="text-[10px]">✎</span>
        </p>
      ) : (
        <div className="flex gap-1.5 py-3.5">
          <input
            value={tempMsg}
            onChange={(e) => setTempMsg(e.target.value)}
            className="flex-1 px-3 py-2 border border-green-300 rounded-lg text-[13px] font-sans"
            autoFocus
          />
          <button
            className="btn-primary px-3.5 py-2 text-xs"
            onClick={() => {
              onUpdateMessage?.(tempMsg);
              setEditing(false);
            }}
          >
            저장
          </button>
        </div>
      )}
    </div>
  );
}
