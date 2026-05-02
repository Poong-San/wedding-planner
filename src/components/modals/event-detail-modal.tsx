"use client";

import { ModalShell } from "./modal-shell";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { CalendarEvent } from "@/types";

interface EventDetailModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onDelete?: (id: number) => void;
}

export function EventDetailModal({ event, onClose, onDelete }: EventDetailModalProps) {
  return (
    <ModalShell title="일정 상세" onClose={onClose}>
      <div className="flex flex-col gap-3 text-[13px]">
        <div>
          <div className="text-[11px] text-ink-500 mb-1">제목</div>
          <div className="text-base font-semibold">{event.title}</div>
        </div>
        <div className="flex gap-3.5">
          <div className="flex-1">
            <div className="text-[11px] text-ink-500 mb-1">날짜</div>
            <div className="font-medium">{event.date}</div>
          </div>
          <div className="flex-1">
            <div className="text-[11px] text-ink-500 mb-1">시간</div>
            <div className="font-medium">{event.time || "-"}</div>
          </div>
        </div>
        <div>
          <div className="text-[11px] text-ink-500 mb-1">카테고리</div>
          <span className="chip chip-active">{CATEGORY_LABELS[event.cat] || "-"}</span>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            className="btn-ghost flex-1 text-red-400"
            onClick={() => { onDelete?.(event.id); onClose(); }}
          >
            삭제
          </button>
          <button className="btn-primary flex-1" onClick={onClose}>닫기</button>
        </div>
      </div>
    </ModalShell>
  );
}
