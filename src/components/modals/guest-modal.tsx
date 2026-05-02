"use client";

import { useState } from "react";
import { ModalShell } from "./modal-shell";
import { Field } from "@/components/ui/field";
import type { Guest, GuestSide, AttendanceStatus } from "@/types";

interface GuestModalProps {
  guest?: Guest;
  onClose: () => void;
  onSave?: (data: Omit<Guest, "id">) => void;
  onDelete?: (id: number) => void;
}

export function GuestModal({ guest, onClose, onSave, onDelete }: GuestModalProps) {
  const [name, setName] = useState(guest?.name || "");
  const [side, setSide] = useState<GuestSide>(guest?.side || "groom");
  const [rel, setRel] = useState(guest?.rel || "친구");
  const [att, setAtt] = useState<AttendanceStatus>(guest?.att || "undecided");
  const [meal, setMeal] = useState(guest?.meal || false);
  const [gift, setGift] = useState(String(guest?.gift || 0));

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave?.({ name, side, rel, att, meal, gift: Number(gift) || 0 });
    onClose();
  };

  return (
    <ModalShell title={guest ? "하객 정보" : "하객 추가"} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Field label="이름">
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" autoFocus />
        </Field>
        <Field label="소속">
          <div className="flex gap-1.5">
            {([["groom", "신랑측"], ["bride", "신부측"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setSide(k)}
                className={`flex-1 py-2.5 rounded-lg font-sans text-[13px] border cursor-pointer ${
                  side === k ? "bg-green-500 text-white border-green-500" : "bg-white text-ink-700 border-ink-200"
                }`}>{l}</button>
            ))}
          </div>
        </Field>
        <Field label="관계">
          <select value={rel} onChange={(e) => setRel(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans bg-white">
            {["가족", "친구", "직장", "지인", "기타"].map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="참석 여부">
          <div className="flex gap-1.5">
            {([["attending", "참석"], ["undecided", "미정"], ["not_attending", "불참"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setAtt(k)}
                className={`flex-1 py-2.5 rounded-lg font-sans text-xs border cursor-pointer ${
                  att === k ? "bg-green-500 text-white border-green-500" : "bg-white text-ink-700 border-ink-200"
                }`}>{l}</button>
            ))}
          </div>
        </Field>
        <Field label="식사">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" checked={meal} onChange={(e) => setMeal(e.target.checked)} />
            식사 인원에 포함
          </label>
        </Field>
        <Field label="축의금 (원)">
          <input type="number" value={gift} onChange={(e) => setGift(e.target.value)}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
        </Field>
        <div className="flex gap-2 mt-1.5">
          {guest && (
            <button className="btn-ghost flex-1 text-red-400"
              onClick={() => { onDelete?.(guest.id); onClose(); }}>삭제</button>
          )}
          <button className="btn-primary flex-1" onClick={handleSubmit}>
            {guest ? "저장" : "추가"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
