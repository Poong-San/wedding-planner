import type { CategoryType, CategoryStatus } from "@/types";

export const CATEGORY_LABELS: Record<CategoryType, string> = {
  wedding_hall: "웨딩홀",
  sdm: "스드메",
  home_goods: "혼수",
  ceremony: "본식",
  honeymoon: "허니문",
  jewelry: "예물",
  yedan: "예단",
  invitation: "청첩장",
  newhome: "신혼집",
  guests: "하객",
};

export const CATEGORY_LIST: { type: CategoryType; name: string }[] = [
  { type: "wedding_hall", name: "웨딩홀" },
  { type: "sdm", name: "스드메" },
  { type: "home_goods", name: "혼수" },
  { type: "ceremony", name: "본식" },
  { type: "honeymoon", name: "허니문" },
  { type: "jewelry", name: "예물" },
  { type: "yedan", name: "예단" },
  { type: "invitation", name: "청첩장" },
  { type: "newhome", name: "신혼집" },
  { type: "guests", name: "하객" },
];

export const STATUS_LABELS: Record<CategoryStatus, string> = {
  pending: "미정",
  consulting: "상담중",
  contracted: "계약완료",
  in_progress: "진행중",
  payment: "잔금",
  completed: "완료",
};

export function getStatusChipClass(status: CategoryStatus): string {
  if (status === "completed" || status === "contracted") return "chip-done";
  if (status === "consulting" || status === "in_progress" || status === "payment") return "chip-active";
  return "chip-pending";
}

export const STATUS_STEP_INDEX: Record<CategoryStatus, number> = {
  pending: -1,
  consulting: 0,
  contracted: 1,
  in_progress: 2,
  payment: 3,
  completed: 4,
};

export const STEP_LABELS = ["상담", "계약", "진행", "잔금", "완료"];
