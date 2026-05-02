import type { CoupleInfo, Category, CalendarEvent, ChecklistItem, Guest, Budget, CategoryType } from "@/types";

export const MOCK_COUPLE: CoupleInfo = {
  bride: "지영",
  groom: "민준",
  weddingDate: "2026-06-14",
  message: "같이 걷는 이 길이 행복합니다",
};

export const MOCK_BUDGET: Budget = { total: 30000000 };

export const MOCK_CATEGORIES: Record<CategoryType, Category> = {
  wedding_hall: {
    type: "wedding_hall", name: "웨딩홀", vendor: "그랜드 컨벤션 웨딩홀",
    manager: "김지원 매니저", contact: "02-1234-5678", address: "서울 강남구 테헤란로 123",
    total: 12000000,
    payments: [
      { label: "계약금", amount: 2000000, date: "2025-11-20", done: true },
      { label: "중도금", amount: 5000000, date: "2026-03-14", done: true },
      { label: "잔금", amount: 5000000, date: "2026-06-07", done: false },
    ],
    eventDate: "2026-06-14", eventTime: "14:00", status: "contracted",
    notes: "식대 1인 65,000원, 보증인원 250명, 시간 변경 1개월 전 가능",
  },
  sdm: {
    type: "sdm", name: "스드메", vendor: "아뜰리에 스튜디오",
    manager: "박지수", contact: "02-555-1234", address: "서울 강남구",
    total: 4000000,
    payments: [
      { label: "계약금", amount: 500000, date: "2026-01-10", done: true },
      { label: "잔금", amount: 3500000, date: "2026-05-04", done: false },
    ],
    eventDate: "2026-05-04", eventTime: "14:00", status: "in_progress",
    notes: "본촬영 5/4, 드레스 2차 피팅 5/12",
  },
  home_goods: { type: "home_goods", name: "혼수", vendor: "", status: "pending", total: 0, payments: [], notes: "" },
  ceremony: { type: "ceremony", name: "본식", vendor: "", status: "consulting", total: 0, payments: [], notes: "사회자, 축가, 식순 미정" },
  honeymoon: {
    type: "honeymoon", name: "허니문", vendor: "다낭 4박 5일",
    manager: "한진여행사", contact: "1588-0000", address: "-",
    total: 3000000,
    payments: [
      { label: "계약금", amount: 300000, date: "2026-02-01", done: true },
      { label: "잔금", amount: 2700000, date: "2026-06-01", done: false },
    ],
    eventDate: "2026-06-16", eventTime: "09:00", status: "contracted",
    notes: "다낭 4박 5일, 풀빌라",
  },
  jewelry: {
    type: "jewelry", name: "예물", vendor: "골든주얼리",
    manager: "최영", contact: "02-777-8888", address: "종로구 귀금속거리",
    total: 2400000,
    payments: [{ label: "전액", amount: 2400000, date: "2026-04-18", done: true }],
    eventDate: "2026-04-18", status: "completed", notes: "커플링 14k",
  },
  yedan: { type: "yedan", name: "예단", vendor: "", status: "pending", total: 0, payments: [], notes: "" },
  invitation: { type: "invitation", name: "청첩장", vendor: "", status: "consulting", total: 0, payments: [], notes: "5/20 미팅 예정" },
  newhome: {
    type: "newhome", name: "신혼집", vendor: "잠실 OO아파트",
    manager: "-", contact: "-", address: "송파구 잠실",
    total: 0, payments: [], status: "completed", notes: "전세 계약 완료",
  },
  guests: { type: "guests", name: "하객", vendor: "", status: "pending", total: 0, payments: [], notes: "" },
};

export const MOCK_EVENTS: CalendarEvent[] = [
  { id: 1, date: "2026-05-04", time: "14:00", title: "스튜디오 본촬영", cat: "sdm" },
  { id: 2, date: "2026-05-04", time: "18:00", title: "양가 상견례", cat: "ceremony" },
  { id: 3, date: "2026-05-12", time: "11:00", title: "드레스 2차 피팅", cat: "sdm" },
  { id: 4, date: "2026-05-15", time: "10:00", title: "한복 가봉", cat: "yedan" },
  { id: 5, date: "2026-05-20", time: "16:00", title: "청첩장 제작 미팅", cat: "invitation" },
  { id: 6, date: "2026-05-25", time: "13:00", title: "신혼집 인테리어 상담", cat: "newhome" },
  { id: 7, date: "2026-05-28", time: "10:00", title: "한복 픽업", cat: "yedan" },
  { id: 8, date: "2026-06-05", time: null, title: "최종 인원 확인", cat: "ceremony" },
  { id: 9, date: "2026-06-14", time: "14:00", title: "결혼식 ♡", cat: "ceremony" },
];

export const MOCK_CHECKLIST: ChecklistItem[] = [
  { id: 1, timeline: "6개월 전", title: "웨딩홀 예약", done: true },
  { id: 2, timeline: "6개월 전", title: "스드메 상담", done: true },
  { id: 3, timeline: "6개월 전", title: "예산 계획 수립", done: true },
  { id: 4, timeline: "3개월 전", title: "청첩장 주문", done: true },
  { id: 5, timeline: "3개월 전", title: "허니문 예약", done: true },
  { id: 6, timeline: "3개월 전", title: "혼수 구매 시작", done: false },
  { id: 7, timeline: "3개월 전", title: "예단 준비", done: false },
  { id: 8, timeline: "1개월 전", title: "청첩장 발송", done: false },
  { id: 9, timeline: "1개월 전", title: "드레스 최종 피팅", done: false },
  { id: 10, timeline: "1개월 전", title: "식순 확정", done: false },
  { id: 11, timeline: "1주 전", title: "최종 인원 확인", done: false },
  { id: 12, timeline: "1주 전", title: "축의금 봉투 준비", done: false },
];

export const MOCK_GUESTS: Guest[] = [
  { id: 1, name: "김민서", side: "bride", rel: "친구", att: "attending", meal: true, gift: 100000 },
  { id: 2, name: "박정훈", side: "groom", rel: "직장", att: "attending", meal: true, gift: 50000 },
  { id: 3, name: "이수진", side: "bride", rel: "가족", att: "attending", meal: true, gift: 300000 },
  { id: 4, name: "최영호", side: "groom", rel: "친구", att: "undecided", meal: false, gift: 0 },
  { id: 5, name: "정혜린", side: "bride", rel: "친구", att: "attending", meal: false, gift: 50000 },
  { id: 6, name: "한승우", side: "groom", rel: "가족", att: "not_attending", meal: false, gift: 100000 },
  { id: 7, name: "윤서연", side: "bride", rel: "직장", att: "attending", meal: true, gift: 50000 },
  { id: 8, name: "장민기", side: "groom", rel: "친구", att: "attending", meal: true, gift: 100000 },
];
