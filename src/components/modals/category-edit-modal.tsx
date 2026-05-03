"use client";

import { useState } from "react";
import { ModalShell } from "./modal-shell";
import { Field } from "@/components/ui/field";
import { FieldSelectorModal } from "@/components/category/field-selector-modal";
import { FieldInputModal } from "@/components/category/field-input-modal";
import type { Category, CategoryStatus, CategoryType, FieldDefinition, FieldType } from "@/types";

interface CategoryEditModalProps {
  category: Category;
  categoryType: string;
  onSave: (updates: Partial<Category>) => void;
  onAddPayment?: (payment: { label: string; amount: number; date: string }) => void;
  onAddField?: (data: { key: string; label: string; value: string; type: FieldType; options: string; isCustom: boolean }) => void;
  onClose: () => void;
}

export function CategoryEditModal({ category, categoryType, onSave, onAddPayment, onAddField, onClose }: CategoryEditModalProps) {
  const [vendor, setVendor] = useState(category.vendor || "");
  const [manager, setManager] = useState(category.manager || "");
  const [contact, setContact] = useState(category.contact || "");
  const [address, setAddress] = useState(category.address || "");
  const [status, setStatus] = useState<CategoryStatus>(category.status);
  const [eventDate, setEventDate] = useState(category.eventDate || "");
  const [eventTime, setEventTime] = useState(category.eventTime || "");
  const [total, setTotal] = useState(String(category.total || ""));
  const [notes, setNotes] = useState(category.notes || "");

  // 납부 일정 추가 인라인
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payLabel, setPayLabel] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState("");

  // 항목 추가
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [selectedFieldDef, setSelectedFieldDef] = useState<FieldDefinition | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSave = () => {
    onSave({
      vendor, manager, contact, address, status,
      eventDate: eventDate || undefined,
      eventTime: eventTime || undefined,
      total: total ? Number(total) : 0,
      notes,
    });
    onClose();
  };

  const handleAddPayment = () => {
    if (!payLabel.trim() || !onAddPayment) return;
    onAddPayment({ label: payLabel, amount: Number(payAmount) || 0, date: payDate });
    setPayLabel(""); setPayAmount(""); setPayDate("");
    setShowPaymentForm(false);
  };

  const statusOptions: { value: CategoryStatus; label: string }[] = [
    { value: "pending", label: "미정" },
    { value: "consulting", label: "상담중" },
    { value: "contracted", label: "계약완료" },
    { value: "in_progress", label: "진행중" },
    { value: "completed", label: "완료" },
  ];

  return (
    <>
      <ModalShell title={`${category.name} 정보 수정`} onClose={onClose}>
        <div className="flex flex-col gap-3">
          <Field label="업체명">
            <input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="업체명을 입력하세요"
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" autoFocus />
          </Field>
          <div className="flex gap-2">
            <Field label="담당자" className="flex-1">
              <input value={manager} onChange={(e) => setManager(e.target.value)} placeholder="담당자 이름"
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
            </Field>
            <Field label="연락처" className="flex-1">
              <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="전화번호"
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
            </Field>
          </div>
          <Field label="주소">
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="주소를 입력하세요"
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
          </Field>
          <Field label="진행 상태">
            <select value={status} onChange={(e) => setStatus(e.target.value as CategoryStatus)}
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans bg-white">
              {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </Field>
          <div className="flex gap-2">
            <Field label="날짜" className="flex-1">
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
            </Field>
            <Field label="시간" className="flex-1">
              <input value={eventTime} onChange={(e) => setEventTime(e.target.value)} placeholder="14:00"
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
            </Field>
          </div>
          <Field label="총 금액 (원)">
            <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="0"
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" />
          </Field>
          <Field label="메모">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="특이사항, 계약 조건 등"
              className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans resize-none" />
          </Field>

          {/* 납부 일정 추가 */}
          <div className="border-t border-ink-200 pt-3 mt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-ink-700">납부 일정</span>
              <button onClick={() => setShowPaymentForm(!showPaymentForm)}
                className="text-[12px] text-green-600 font-medium bg-transparent border-none cursor-pointer">
                {showPaymentForm ? "취소" : "+ 추가"}
              </button>
            </div>
            {showPaymentForm && (
              <div className="flex flex-col gap-2 p-3 bg-ink-50 rounded-lg mb-2">
                <input value={payLabel} onChange={(e) => setPayLabel(e.target.value)} placeholder="항목명 (예: 계약금)"
                  className="w-full px-3 py-2 border border-ink-200 rounded-lg text-[13px] font-sans" />
                <div className="flex gap-2">
                  <input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="금액 (원)"
                    className="flex-1 px-3 py-2 border border-ink-200 rounded-lg text-[13px] font-sans" />
                  <input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-ink-200 rounded-lg text-[13px] font-sans" />
                </div>
                <button onClick={handleAddPayment}
                  className="px-3 py-2 bg-green-500 text-white rounded-lg text-[13px] font-sans font-medium border-none cursor-pointer">
                  납부 일정 추가
                </button>
              </div>
            )}
          </div>

          {/* 항목 추가 */}
          <div className="border-t border-ink-200 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-ink-700">상세 항목</span>
              <button onClick={() => setShowFieldSelector(true)}
                className="text-[12px] text-green-600 font-medium bg-transparent border-none cursor-pointer">
                + 추가
              </button>
            </div>
          </div>

          <button className="btn-primary mt-1.5" onClick={handleSave}>저장</button>
        </div>
      </ModalShell>

      {showFieldSelector && (
        <FieldSelectorModal
          categoryType={categoryType as CategoryType}
          existingKeys={[]}
          onSelect={(def) => { setShowFieldSelector(false); setSelectedFieldDef(def); }}
          onCustom={() => { setShowFieldSelector(false); setShowCustomInput(true); }}
          onClose={() => setShowFieldSelector(false)}
        />
      )}

      {selectedFieldDef && onAddField && (
        <FieldInputModal
          definition={selectedFieldDef}
          onSave={(data) => { onAddField(data); setSelectedFieldDef(null); }}
          onClose={() => setSelectedFieldDef(null)}
        />
      )}

      {showCustomInput && onAddField && (
        <FieldInputModal
          onSave={(data) => { onAddField(data); setShowCustomInput(false); }}
          onClose={() => setShowCustomInput(false)}
        />
      )}
    </>
  );
}
