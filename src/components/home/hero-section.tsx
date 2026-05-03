"use client";

import { useState } from "react";
import { daysUntil } from "@/lib/utils";
import { CoupleEditModal } from "@/components/modals/couple-edit-modal";
import type { CoupleInfo } from "@/types";

interface HeroSectionProps {
  couple: CoupleInfo;
  onUpdateCouple?: (updates: Partial<CoupleInfo>) => void;
  onUpdateMessage?: (message: string) => void; // keep for backward compat
}

export function HeroSection({ couple, onUpdateCouple, onUpdateMessage }: HeroSectionProps) {
  const dday = daysUntil(couple.weddingDate);
  const [showEdit, setShowEdit] = useState(false);

  const handleSave = (updates: Partial<CoupleInfo>) => {
    onUpdateCouple?.(updates);
    if (updates.message) onUpdateMessage?.(updates.message);
  };

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

        {/* 편집 버튼 */}
        <button
          onClick={() => setShowEdit(true)}
          className="absolute top-3.5 right-3.5 bg-white/85 px-2.5 py-1 rounded-full text-[11px] text-green-700 font-semibold border-none cursor-pointer"
        >
          ✎ 편집
        </button>

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

      {/* 메시지 표시 (클릭하면 편집 모달) */}
      <p
        onClick={() => setShowEdit(true)}
        className="text-center text-[13px] text-ink-500 my-3.5 italic cursor-pointer"
      >
        &ldquo;{couple.message}&rdquo; <span className="text-[10px]">✎</span>
      </p>

      {showEdit && (
        <CoupleEditModal
          couple={couple}
          onSave={handleSave}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
