import type { Category } from "@/types";

/** D-day 계산: 오늘부터 목표일까지 남은 일수 */
export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/** 카테고리 납부 완료 금액 합계 */
export function getCategorySpent(cat: Category): number {
  if (!cat.payments || cat.payments.length === 0) return 0;
  return cat.payments.filter((p) => p.done).reduce((sum, p) => sum + p.amount, 0);
}

/** 카테고리 총 계약 금액 */
export function getCategoryTotal(cat: Category): number {
  return cat.total || 0;
}

/** 만원 단위 포맷: 12000000 → "1,200" */
export function formatManWon(amount: number): string {
  return Math.round(amount / 10000).toLocaleString();
}

/** 날짜 포맷: "2026-05-04" → { month: "5", day: "04" } */
export function parseDate(dateStr: string): { month: string; day: string } {
  const parts = dateStr.split("-");
  return { month: String(Number(parts[1])), day: parts[2] };
}

/** 시간 포맷: "14:00:00" → "14:00" */
export function formatTime(time: string | null): string {
  if (!time) return "";
  return time.slice(0, 5);
}
