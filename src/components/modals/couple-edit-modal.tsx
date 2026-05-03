"use client";

import { useRef, useState } from "react";
import { ModalShell } from "./modal-shell";
import { Field } from "@/components/ui/field";
import type { CoupleInfo } from "@/types";

interface CoupleEditModalProps {
  couple: CoupleInfo;
  onSave: (updates: Partial<CoupleInfo>) => void;
  onUploadImage?: (file: File) => void;
  onClose: () => void;
}

export function CoupleEditModal({ couple, onSave, onUploadImage, onClose }: CoupleEditModalProps) {
  const [bride, setBride] = useState(couple.bride);
  const [groom, setGroom] = useState(couple.groom);
  const [weddingDate, setWeddingDate] = useState(couple.weddingDate);
  const [message, setMessage] = useState(couple.message);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave({ bride, groom, weddingDate, message });
    onClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;
    setUploading(true);
    await onUploadImage(file);
    setUploading(false);
  };

  return (
    <ModalShell title="커플 정보 수정" onClose={onClose}>
      <div className="flex flex-col gap-3">
        {/* 대표 이미지 변경 */}
        <Field label="대표 이미지">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans text-left text-ink-500 bg-white cursor-pointer disabled:opacity-50"
          >
            {uploading ? "업로드 중..." : "📷 이미지 변경"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </Field>

        <div className="flex gap-2">
          <Field label="신부 이름" className="flex-1">
            <input value={bride} onChange={(e) => setBride(e.target.value)}
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
          </Field>
          <Field label="신랑 이름" className="flex-1">
            <input value={groom} onChange={(e) => setGroom(e.target.value)}
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
          </Field>
        </div>
        <Field label="결혼식 날짜">
          <input type="date" value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
        </Field>
        <Field label="커플 메시지">
          <input value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder="같이 걷는 이 길이 행복합니다"
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
        </Field>
        <button className="btn-primary mt-1.5" onClick={handleSave}>저장</button>
      </div>
    </ModalShell>
  );
}
