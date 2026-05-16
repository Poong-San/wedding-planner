"use client";

import { useState } from "react";
import { ModalShell } from "@/components/modals/modal-shell";
import { Field } from "@/components/ui/field";
import type { FieldDefinition, FieldType } from "@/types";

interface FieldInputModalProps {
  definition?: FieldDefinition;
  initialValue?: string;
  onSave: (data: { key: string; label: string; value: string; type: FieldType; options: string; isCustom: boolean }) => void;
  onClose: () => void;
}

export function FieldInputModal({ definition, initialValue, onSave, onClose }: FieldInputModalProps) {
  const isCustom = !definition;
  const [label, setLabel] = useState(definition?.label || "");
  const [value, setValue] = useState(initialValue || "");
  const [fieldType, setFieldType] = useState<FieldType>(definition?.type || "text");

  const handleSave = () => {
    if (isCustom && !label.trim()) return;
    onSave({
      key: definition?.key || label.trim().toLowerCase().replace(/\s+/g, "_"),
      label: definition?.label || label.trim(),
      value,
      type: definition?.type || fieldType,
      options: definition?.options?.join(",") || "",
      isCustom,
    });
    onClose();
  };

  return (
    <ModalShell title={isCustom ? "직접 입력" : definition!.label} onClose={onClose}>
      <div className="flex flex-col gap-3">
        {isCustom && (
          <>
            <Field label="항목 이름">
              <input value={label} onChange={(e) => setLabel(e.target.value)}
                placeholder="예: 추가 비용"
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans" autoFocus />
            </Field>
            <Field label="입력 타입">
              <select value={fieldType} onChange={(e) => setFieldType(e.target.value as FieldType)}
                className="w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans bg-white">
                <option value="text">텍스트</option>
                <option value="number">숫자</option>
                <option value="date">날짜</option>
                <option value="textarea">긴 텍스트</option>
                <option value="boolean">예/아니오</option>
              </select>
            </Field>
          </>
        )}

        <Field label={isCustom ? "값" : definition!.label}>
          {renderInput(definition?.type || fieldType, value, setValue, definition?.options)}
        </Field>

        <button className="btn-primary mt-1.5" onClick={handleSave}>저장</button>
      </div>
    </ModalShell>
  );
}

function renderInput(
  type: FieldType, value: string,
  onChange: (v: string) => void,
  options?: string[]
) {
  const inputClass = "w-full px-3 py-2.5 border border-ink-200 rounded-lg text-[13px] font-sans";

  switch (type) {
    case "number":
      return <input type="number" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="0" className={inputClass} />;
    case "date":
      return <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
        className={inputClass} />;
    case "select":
      return (
        <div className="flex flex-col gap-2">
          <select value={(options || []).includes(value) || value === "" ? value : "__custom__"}
            onChange={(e) => onChange(e.target.value === "__custom__" ? "" : e.target.value)}
            className={`${inputClass} bg-white`}>
            <option value="">선택하세요</option>
            {(options || []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            <option value="__custom__">기타 직접 입력</option>
          </select>
          {value !== "" && !(options || []).includes(value) && (
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
              placeholder="직접 입력하세요" className={inputClass} />
          )}
          {value === "" && (
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
              placeholder="기타를 선택하면 직접 입력할 수 있어요" className={inputClass} />
          )}
        </div>
      );
    case "textarea":
      return <textarea value={value} onChange={(e) => onChange(e.target.value)}
        rows={3} placeholder="내용을 입력하세요"
        className={`${inputClass} resize-none`} />;
    case "boolean":
      return (
        <label className="flex items-center gap-2 text-[13px] cursor-pointer">
          <input type="checkbox" checked={value === "true"}
            onChange={(e) => onChange(String(e.target.checked))} />
          {value === "true" ? "예" : "아니오"}
        </label>
      );
    default:
      return <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="입력하세요" className={inputClass} />;
  }
}
