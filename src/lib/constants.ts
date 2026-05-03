import type { CategoryType, CategoryStatus, MainTabType } from "@/types";

// 메인 탭 정의 (홈 화면에 표시)
export const MAIN_TABS: { type: MainTabType; name: string }[] = [
  { type: "wedding_hall", name: "웨딩홀" },
  { type: "sdm", name: "스드메" },
  { type: "ceremony", name: "본식" },
  { type: "home_goods", name: "혼수" },
  { type: "honeymoon", name: "허니문" },
];

// 메인 탭 → 세부 카테고리 매핑
export const SUB_CATEGORIES: Record<MainTabType, { type: CategoryType; name: string }[]> = {
  wedding_hall: [], // 단독 — 세부 없음
  sdm: [
    { type: "studio", name: "스튜디오" },
    { type: "dress", name: "드레스" },
    { type: "hair_makeup", name: "헤어메이크업" },
  ],
  ceremony: [
    { type: "invitation", name: "청첩장" },
    { type: "video", name: "영상" },
    { type: "mc", name: "사회" },
    { type: "singer", name: "축가" },
    { type: "guests", name: "하객" },
    { type: "return_gift", name: "답례품" },
  ],
  home_goods: [
    { type: "wedding_ring", name: "웨딩링" },
    { type: "newhome", name: "신혼집" },
    { type: "appliance", name: "가전" },
    { type: "furniture", name: "가구" },
    { type: "jewelry", name: "예물" },
    { type: "yedan", name: "예단" },
  ],
  honeymoon: [], // 단독 — 세부 없음
};

// 모든 카테고리 라벨
export const CATEGORY_LABELS: Record<CategoryType, string> = {
  wedding_hall: "웨딩홀",
  studio: "스튜디오", dress: "드레스", hair_makeup: "헤어메이크업",
  invitation: "청첩장", video: "영상", mc: "사회", singer: "축가", guests: "하객", return_gift: "답례품",
  wedding_ring: "웨딩링", newhome: "신혼집", appliance: "가전", furniture: "가구", jewelry: "예물", yedan: "예단",
  honeymoon: "허니문",
};

// 메인 탭 라벨
export const MAIN_TAB_LABELS: Record<MainTabType, string> = {
  wedding_hall: "웨딩홀",
  sdm: "스드메",
  ceremony: "본식",
  home_goods: "혼수",
  honeymoon: "허니문",
};

// 메인 탭 타입인지 확인 + 해당 탭의 카테고리 타입 반환
export function getMainTabForCategory(catType: CategoryType): MainTabType | null {
  if (catType === "wedding_hall") return "wedding_hall";
  if (catType === "honeymoon") return "honeymoon";
  for (const [mainTab, subs] of Object.entries(SUB_CATEGORIES)) {
    if (subs.some(s => s.type === catType)) return mainTab as MainTabType;
  }
  return null;
}

// 상태 관련
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
