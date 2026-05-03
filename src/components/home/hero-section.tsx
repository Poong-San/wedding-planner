"use client";

import { useRef, useState } from "react";
import { daysUntil } from "@/lib/utils";
import { CoupleEditModal } from "@/components/modals/couple-edit-modal";
import type { CoupleInfo } from "@/types";

interface HeroSectionProps {
  couple: CoupleInfo;
  heroImage: string | null;
  onUpdateCouple?: (updates: Partial<CoupleInfo>) => void;
  onUpdateMessage?: (message: string) => void;
  onUploadImage?: (file: File) => void;
}

export function HeroSection({ couple, heroImage, onUpdateCouple, onUpdateMessage, onUploadImage }: HeroSectionProps) {
  const dday = daysUntil(couple.weddingDate);
  const [showEdit, setShowEdit] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;
    setUploading(true);
    await onUploadImage(file);
    setUploading(false);
  };

  const handleSave = (updates: Partial<CoupleInfo>) => {
    onUpdateCouple?.(updates);
    if (updates.message) onUpdateMessage?.(updates.message);
  };

  const stripedBg = "repeating-linear-gradient(45deg, #f5e8e0, #f5e8e0 8px, #fdf9f3 8px, #fdf9f3 16px)";

  return (
    <div className="px-4">
      <div
        className="h-[280px] rounded-[20px] relative border border-green-200 overflow-hidden"
        style={
          heroImage
            ? { backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: stripedBg }
        }
      >
        <div className="absolute inset-0 rounded-[20px]"
          style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.45) 100%)" }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute top-3.5 left-3.5 bg-white/85 w-8 h-8 rounded-full flex items-center justify-center text-[14px] border-none cursor-pointer disabled:opacity-50"
          aria-label="히어로 이미지 업로드"
        >
          {uploading ? "⏳" : "📷"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

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
