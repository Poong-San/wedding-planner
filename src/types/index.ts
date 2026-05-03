// 카테고리 타입 키 (세부 카테고리 포함)
export type CategoryType =
  // 웨딩홀 (단독)
  | "wedding_hall"
  // 스드메 세부
  | "studio" | "dress" | "hair_makeup"
  // 본식 세부
  | "invitation" | "video" | "mc" | "singer" | "guests" | "return_gift" | "meeting"
  // 혼수 세부
  | "wedding_ring" | "newhome" | "appliance" | "furniture" | "jewelry" | "yedan"
  // 허니문 (단독)
  | "honeymoon";

// 메인 탭 키
export type MainTabType = "wedding_hall" | "sdm" | "ceremony" | "home_goods" | "honeymoon";

// 진행 상태 (6단계)
export type CategoryStatus = "pending" | "consulting" | "contracted" | "in_progress" | "payment" | "completed";

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
  id: number | string;
  date: string;
  time: string | null;
  title: string;
  cat: CategoryType;
}

// 체크리스트 항목
export interface ChecklistItem {
  id: number | string;
  timeline: string;
  title: string;
  done: boolean;
}

// 하객
export interface Guest {
  id: number | string;
  name: string;
  side: GuestSide;
  rel: string;
  att: AttendanceStatus;
  meal: boolean;
  gift: number;
}

// 커플 정보
export interface CoupleInfo {
  bride: string;
  groom: string;
  weddingDate: string;
  message: string;
}

// 예산
export interface Budget {
  total: number;
}

// 필드 타입
export type FieldType = "text" | "number" | "date" | "select" | "textarea" | "boolean";

// 카테고리 필드 (DB에 저장되는 데이터)
export interface CategoryField {
  id: string;
  categoryId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldValue: string;
  fieldType: FieldType;
  fieldOptions: string;
  isCustom: boolean;
  sortOrder: number;
}

// 추천 필드 정의 (프론트엔드 상수)
export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
}
