"use client";

import { useState } from "react";
import { ModalShell } from "./modal-shell";
import { Field } from "@/components/ui/field";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { CategoryType } from "@/types";

interface AddEventModalProps {
  date: string;
  onClose: () => void;
  onAdd?: (event: { title: string; date: string; time: string; cat: CategoryType }) => void;
}

export function AddEventModal({ date, onClose, onAdd }: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [cat, setCat] = useState<CategoryType>("wedding_hall");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd?.({ title, date, time, cat });
    onClose();
  };

  return (
    <ModalShell title="일정 추가" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Field label="제목">
          <input
            value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 드레스 피팅"
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans"
            autoFocus
          />
        </Field>
        <div className="flex gap-2.5">
          <Field label="날짜" className="flex-1">
            <div className="px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] text-ink-500">
              {date}
            </div>
          </Field>
          <Field label="시간" className="flex-1">
            <input
              value={time} onChange={(e) => setTime(e.target.value)}
              placeholder="14:00"
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans"
            />
          </Field>
        </div>
        <Field label="카테고리">
          <select
            value={cat} onChange={(e) => setCat(e.target.value as CategoryType)}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans bg-white"
          >
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>
        <button className="btn-primary mt-1.5" onClick={handleSubmit}>추가</button>
      </div>
    </ModalShell>
  );
}
