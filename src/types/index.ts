// 카테고리 타입 키
export type CategoryType =
  | "wedding_hall" | "sdm" | "home_goods" | "ceremony"
  | "honeymoon" | "jewelry" | "yedan" | "invitation" | "newhome";

// 진행 상태 (5단계)
export type CategoryStatus = "pending" | "consulting" | "contracted" | "in_progress" | "completed";

// 참석 여부
export type AttendanceStatus = "attending" | "not_attending" | "undecided";

// 하객 소속
export type GuestSide = "groom" | "bride";

// 납부 항목
export interface Payment {
  label: string;
  amount: number;
  date: string;
  done: boolean;
}

// 카테고리 데이터
export interface Category {
  type: CategoryType;
  name: string;
  vendor: string;
  manager?: string;
  contact?: string;
  address?: string;
  total: number;
  payments: Payment[];
  eventDate?: string;
  eventTime?: string;
  status: CategoryStatus;
  notes: string;
}

// 일정
export interface CalendarEvent {
  id: number;
  date: string;       // YYYY-MM-DD
  time: string | null;
  title: string;
  cat: CategoryType;
}

// 체크리스트 항목
export interface ChecklistItem {
  id: number;
  timeline: string;   // "6개월 전", "3개월 전", "1개월 전", "1주 전"
  title: string;
  done: boolean;
}

// 하객
export interface Guest {
  id: number;
  name: string;
  side: GuestSide;
  rel: string;         // 관계: 가족, 친구, 직장, 지인
  att: AttendanceStatus;
  meal: boolean;
  gift: number;
}

// 커플 정보
export interface CoupleInfo {
  bride: string;
  groom: string;
  weddingDate: string; // YYYY-MM-DD
  message: string;
}

// 예산
export interface Budget {
  total: number;
}
