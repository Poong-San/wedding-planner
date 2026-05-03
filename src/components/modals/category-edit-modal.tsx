"use client";

import { useState } from "react";
import { ModalShell } from "./modal-shell";
import { Field } from "@/components/ui/field";
import type { Category, CategoryStatus } from "@/types";

interface CategoryEditModalProps {
  category: Category;
  onSave: (updates: Partial<Category>) => void;
  onClose: () => void;
}

export function CategoryEditModal({ category, onSave, onClose }: CategoryEditModalProps) {
  const [vendor, setVendor] = useState(category.vendor || "");
  const [manager, setManager] = useState(category.manager || "");
  const [contact, setContact] = useState(category.contact || "");
  const [address, setAddress] = useState(category.address || "");
  const [status, setStatus] = useState<CategoryStatus>(category.status);
  const [eventDate, setEventDate] = useState(category.eventDate || "");
  const [eventTime, setEventTime] = useState(category.eventTime || "");
  const [total, setTotal] = useState(String(category.total || ""));
  const [notes, setNotes] = useState(category.notes || "");

  const handleSave = () => {
    onSave({
      vendor,
      manager,
      contact,
      address,
      status,
      eventDate: eventDate || undefined,
      eventTime: eventTime || undefined,
      total: total ? Number(total) : 0,
      notes,
    });
    onClose();
  };

  const statusOptions: { value: CategoryStatus; label: string }[] = [
    { value: "pending", label: "미정" },
    { value: "consulting", label: "상담중" },
    { value: "contracted", label: "계약완료" },
    { value: "in_progress", label: "진행중" },
    { value: "completed", label: "완료" },
  ];

  return (
    <ModalShell title={`${category.name} 정보 수정`} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Field label="업체명">
          <input
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            placeholder="업체명을 입력하세요"
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans"
            autoFocus
          />
        </Field>
        <div className="flex gap-2">
          <Field label="담당자" className="flex-1">
            <input
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              placeholder="담당자 이름"
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans"
            />
          </Field>
          <Field label="연락처" className="flex-1">
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="전화번호"
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans"
            />
          </Field>
        </div>
        <Field label="주소">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소를 입력하세요"
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans"
          />
        </Field>
        <Field label="진행 상태">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CategoryStatus)}
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans bg-white"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex gap-2">
          <Field label="날짜" className="flex-1">
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans"
            />
          </Field>
          <Field label="시간" className="flex-1">
            <input
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              placeholder="14:00"
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans"
            />
          </Field>
        </div>
        <Field label="총 금액 (원)">
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans"
          />
        </Field>
        <Field label="메모">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="특이사항, 계약 조건 등"
            className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans resize-none"
          />
        </Field>
        <button className="btn-primary mt-1.5" onClick={handleSave}>
          저장
        </button>
      </div>
    </ModalShell>
  );
}
