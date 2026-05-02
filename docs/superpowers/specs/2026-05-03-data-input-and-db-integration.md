# 데이터 입력 + DB 연동 설계 문서

## 개요

결혼준비 앱의 모든 기능에 실제 데이터 입력/수정/삭제 기능을 추가하고, Supabase(PostgreSQL)와 연동한다. 카테고리별로 다른 입력 항목을 유연한 필드 시스템으로 처리하며, 목 데이터를 실시간 DB 데이터로 교체한다.

## 변경 사항 요약

### 1. 네비게이션 구조 변경

**하단 네비 (6탭 → 5탭)**

| 변경 전 | 변경 후 |
|---------|---------|
| 홈, 캘린더, 예약현황, 예산, 체크리스트, 하객 | 홈, 캘린더, 예약현황, 예산, 체크리스트 |

**상단 카테고리 탭 (9개 → 10개)**

| 변경 전 | 변경 후 |
|---------|---------|
| 웨딩홀, 스드메, 혼수, 본식, 허니문, 예물, 예단, 청첩장, 신혼집 | 웨딩홀, 스드메, 혼수, 본식, 허니문, 예물, 예단, 청첩장, 신혼집, **하객** |

- 하객은 더 이상 하단 네비 탭이 아니라 상단 카테고리 중 하나로 취급
- 하객 카테고리의 상세 페이지는 기존 하객관리 화면(통계 + 신랑/신부 분리 + 리스트)을 그대로 유지
- `/guests` 라우트는 `/category/guests`로 변경

### 2. 카테고리별 유연한 필드 시스템

#### 핵심 개념

각 카테고리(웨딩홀, 스드메 등)는 고유한 입력 항목이 있다. 이를 하드코딩하지 않고, **추천 필드 목록 + 커스텀 필드**로 유연하게 처리한다.

#### 동작 흐름

1. 카테고리 상세 페이지에 **+ 항목 추가** 버튼이 있음
2. 버튼 클릭 → **바텀시트 모달**에 해당 카테고리의 추천 필드 목록 표시
3. 이미 추가된 필드는 체크 표시로 구분
4. 필드 선택 → **입력 모달**이 열림 (필드 타입에 맞는 입력 UI)
5. 값 입력 후 저장 → 카테고리 상세 페이지에 해당 필드가 표시됨
6. 추천 목록 하단에 **"직접 입력"** 옵션 → 필드명과 값을 자유롭게 입력

#### 필드 타입

| 타입 | 입력 UI | 예시 |
|------|---------|------|
| text | 텍스트 입력 | 업체명, 담당자, 주소 |
| number | 숫자 입력 (만원 단위 포맷) | 식대 단가, 대관료 |
| date | 날짜 선택 | 촬영 날짜, 입주 예정일 |
| select | 드롭다운 선택 | 예식 형태, 계약 형태 |
| textarea | 여러 줄 텍스트 | 메모, 식순 |
| boolean | 토글 스위치 | 폐백실 유무, 원본 제공 여부 |

#### 카테고리별 추천 필드 목록

##### 웨딩홀 (wedding_hall)

| 필드 키 | 라벨 | 타입 | 옵션 |
|---------|------|------|------|
| vendor | 업체명 | text | |
| manager | 담당자 / 연락처 | text | |
| address | 주소 | text | |
| event_date | 예식 날짜 | date | |
| event_time | 예식 시간 | text | |
| hall_name | 홀 이름 | text | |
| ceremony_type | 예식 형태 | select | 일반, 채플, 야외, 하우스 |
| rental_fee | 대관료 | number | |
| meal_price | 식대 단가 (1인) | number | |
| guaranteed_guests | 보증인원 | number | |
| extra_guest_price | 추가인원 단가 | number | |
| flower_cost | 꽃장식 비용 | number | |
| pyebaek_cost | 폐백 음식 비용 | number | |
| parking_count | 주차 가능 대수 | number | |
| has_pyebaek_room | 폐백실 유무 | boolean | |
| has_bride_room | 신부대기실 유무 | boolean | |
| meal_type | 식사 메뉴 | select | 뷔페, 한식, 양식, 중식 |
| guest_waiting_area | 하객 대기 공간 | text | |
| ceremony_duration | 예식 시간 (분) | number | |
| concurrent_ceremonies | 동시간대 예식 수 | number | |
| time_change_policy | 시간 변경 가능 여부 | text | |
| memo | 메모 | textarea | |

##### 스드메 (sdm)

| 필드 키 | 라벨 | 타입 | 옵션 |
|---------|------|------|------|
| studio_vendor | 스튜디오 업체명 | text | |
| dress_vendor | 드레스 업체명 | text | |
| makeup_vendor | 메이크업 업체명 | text | |
| manager | 담당자 / 연락처 | text | |
| studio_cost | 스튜디오 촬영 비용 | number | |
| dress_cost | 드레스 대여 비용 | number | |
| makeup_cost | 메이크업 비용 | number | |
| package_total | 패키지 총 금액 | number | |
| shoot_concept | 촬영 컨셉 / 장소 | text | |
| shoot_date | 촬영 날짜 | date | |
| edited_photo_count | 보정본 수량 | number | |
| raw_photos_included | 원본 제공 여부 | boolean | |
| album_type | 앨범 종류 / 수량 | text | |
| fitting_date | 드레스 피팅 날짜 | date | |
| dress_type | 드레스 종류 | select | A라인, 머메이드, 볼가운, 엠파이어, 기타 |
| rehearsal_makeup_date | 리허설 메이크업 날짜 | date | |
| ceremony_makeup_included | 본식 메이크업 포함 여부 | boolean | |
| extra_shoot_cost | 추가 촬영 비용 (시간당) | number | |
| memo | 메모 | textarea | |

##### 혼수 (home_goods)

| 필드 키 | 라벨 | 타입 | 옵션 |
|---------|------|------|------|
| appliance_list | 가전 목록 | textarea | |
| furniture_list | 가구 목록 | textarea | |
| living_goods_list | 생활용품 목록 | textarea | |
| item_cost | 품목별 금액 | number | |
| store | 구매처 | text | |
| purchase_status | 구매 상태 | select | 예정, 주문, 배송중, 완료 |
| delivery_date | 배송 예정일 | date | |
| cost_split | 신랑측/신부측 부담 | select | 신랑측, 신부측, 공동 |
| brand_model | 브랜드 / 모델명 | text | |
| memo | 메모 | textarea | |

##### 본식 (ceremony)

| 필드 키 | 라벨 | 타입 | 옵션 |
|---------|------|------|------|
| mc_name | 사회자 이름 | text | |
| mc_contact | 사회자 연락처 | text | |
| singer_name | 축가 가수명 | text | |
| singer_song | 축가 곡명 | text | |
| officiant_name | 주례 이름 | text | |
| officiant_org | 주례 소속 | text | |
| video_vendor | 영상 촬영 업체 | text | |
| snap_vendor | 스냅 촬영 업체 | text | |
| mc_cost | 사회자 비용 | number | |
| singer_cost | 축가 비용 | number | |
| video_cost | 영상 촬영 비용 | number | |
| snap_cost | 스냅 촬영 비용 | number | |
| ceremony_order | 식순 | textarea | |
| pyebaek_order | 폐백 순서 | textarea | |
| gift_collector | 축의금 수합 담당 | text | |
| reception_staff | 안내/접수 담당 | text | |
| flower_management | 화환 관리 | text | |
| memo | 메모 | textarea | |

##### 허니문 (honeymoon)

| 필드 키 | 라벨 | 타입 | 옵션 |
|---------|------|------|------|
| destination | 여행지 | text | |
| travel_agency | 여행사 / 담당자 | text | |
| departure_date | 출발일 | date | |
| return_date | 귀국일 | date | |
| duration | 일정 (N박 N일) | text | |
| package_cost | 패키지 총 비용 | number | |
| flight_cost | 항공권 비용 | number | |
| hotel_cost | 숙소 비용 | number | |
| insurance_cost | 여행자 보험 | number | |
| flight_info | 항공편 (편명/시간) | text | |
| hotel_name | 숙소명 / 주소 | text | |
| hotel_type | 숙소 타입 | select | 호텔, 리조트, 풀빌라, 에어비앤비, 기타 |
| passport_expiry | 여권 유효기간 확인 | date | |
| visa_required | 비자 필요 여부 | boolean | |
| exchange_info | 환전 정보 | text | |
| activities | 액티비티 / 투어 예약 | textarea | |
| memo | 메모 | textarea | |

##### 예물 (jewelry)

| 필드 키 | 라벨 | 타입 | 옵션 |
|---------|------|------|------|
| vendor | 업체명 / 브랜드 | text | |
| manager | 담당자 / 연락처 | text | |
| ring_cost | 커플링 금액 | number | |
| watch_cost | 시계 금액 | number | |
| necklace_cost | 목걸이/귀걸이 금액 | number | |
| ring_material | 커플링 소재 | select | 14K, 18K, PT(백금), 기타 |
| ring_size | 커플링 사이즈 | text | |
| engraving | 각인 내용 | text | |
| pickup_date | 수령 예정일 | date | |
| warranty | 보증서 / AS 조건 | text | |
| memo | 메모 | textarea | |

##### 예단 (yedan)

| 필드 키 | 라벨 | 타입 | 옵션 |
|---------|------|------|------|
| yedan_type | 예단 형태 | select | 현금, 현물, 혼합 |
| groom_to_bride | 신랑측 → 신부측 금액 | number | |
| bride_to_groom | 신부측 → 신랑측 금액 | number | |
| hanbok_bride | 한복 (신부) 업체/금액 | text | |
| hanbok_groom | 한복 (신랑) 업체/금액 | text | |
| hanbok_mother_in_law | 한복 (시어머니) 업체/금액 | text | |
| hanbok_mother | 한복 (장모님) 업체/금액 | text | |
| bedding | 이불 (업체/수량/금액) | text | |
| delivery_date | 예단 전달 날짜 | date | |
| ham_info | 함 (함진아비/날짜) | text | |
| memo | 메모 | textarea | |

##### 청첩장 (invitation)

| 필드 키 | 라벨 | 타입 | 옵션 |
|---------|------|------|------|
| vendor | 업체명 | text | |
| manager | 담당자 / 연락처 | text | |
| unit_price | 단가 (장당) | number | |
| total_cost | 총 금액 | number | |
| design_type | 디자인 종류 | select | 종이, 모바일, 둘 다 |
| quantity | 수량 | number | |
| design_confirm_date | 시안 확정일 | date | |
| print_complete_date | 인쇄 완료일 | date | |
| send_start_date | 발송 시작일 | date | |
| mobile_url | 모바일 청첩장 URL | text | |
| message_content | 문구 내용 | textarea | |
| memo | 메모 | textarea | |

##### 신혼집 (newhome)

| 필드 키 | 라벨 | 타입 | 옵션 |
|---------|------|------|------|
| address | 주소 | text | |
| contract_type | 계약 형태 | select | 전세, 월세, 매매 |
| realtor | 부동산 / 담당자 | text | |
| deposit | 보증금 / 매매가 | number | |
| monthly_rent | 월세 | number | |
| interior_cost | 인테리어 비용 | number | |
| brokerage_fee | 중개수수료 | number | |
| area | 면적 (평수/㎡) | text | |
| rooms | 방/화장실 수 | text | |
| move_in_date | 입주 예정일 | date | |
| contract_date | 계약일 | date | |
| interior_vendor | 인테리어 업체 | text | |
| interior_start_date | 인테리어 시작일 | date | |
| interior_end_date | 인테리어 완료일 | date | |
| memo | 메모 | textarea | |

##### 하객 (guests)

하객은 기존 하객관리 화면을 그대로 유지한다. 카테고리 상세 페이지 대신 전용 하객관리 UI(통계 카드 + 신랑/신부 분리 탭 + 리스트 + 추가/수정 모달)를 렌더링한다.

### 3. DB 스키마 변경

#### 새 테이블: `category_fields`

```sql
create table public.category_fields (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  field_key text not null,        -- 추천 필드 키 또는 커스텀 키
  field_label text not null,      -- 표시 라벨
  field_value text default '',    -- 값 (모든 타입을 text로 저장)
  field_type text default 'text', -- text, number, date, select, textarea, boolean
  field_options text default '',  -- select 타입의 옵션 (콤마 구분)
  is_custom boolean default false,-- 커스텀 필드 여부
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

RLS 정책: 기존 `categories` 테이블과 동일하게 `category_id`를 통해 소유자/파트너만 접근.

#### 기존 테이블 변경 없음

`categories`, `payments`, `events`, `checklist_items`, `guests`, `profiles`, `budgets` 테이블은 그대로 유지.

### 4. 추천 필드 정의 저장 위치

추천 필드 목록(필드 키, 라벨, 타입, 옵션)은 **프론트엔드 상수**로 관리한다 (`src/lib/field-definitions.ts`). DB에 저장하지 않는 이유:
- 추천 필드는 앱 전체에서 동일 (사용자별로 다르지 않음)
- 프론트엔드에서 바로 참조해야 바텀시트 목록을 빠르게 렌더링
- 사용자가 실제로 추가한 필드만 `category_fields` 테이블에 저장

### 5. Supabase 연동 범위

목 데이터(`src/lib/mock-data.ts`)를 Supabase 실시간 데이터로 교체한다.

| 기능 | 데이터 소스 | CRUD |
|------|-----------|------|
| 홈 화면 (D-day, 이름, 메시지) | `profiles` 테이블 | Read + Update |
| 카테고리 목록 + 상태 | `categories` 테이블 | Read + Update |
| 카테고리 유연한 필드 | `category_fields` 테이블 | Create + Read + Update + Delete |
| 납부 일정 | `payments` 테이블 | Read + Update (토글) |
| 캘린더 일정 | `events` 테이블 | Create + Read + Delete |
| 체크리스트 | `checklist_items` 테이블 | Read + Update (토글) |
| 하객 | `guests` 테이블 | Create + Read + Update + Delete |
| 예산 | `categories` + `category_fields`에서 비용 필드 집계 | Read (자동 계산) |

### 6. 초기 데이터 시딩

회원가입 시 자동으로 9개 카테고리(웨딩홀~신혼집)를 `categories` 테이블에 생성한다. 기본 체크리스트 템플릿(12개 항목)도 자동 생성한다. 하객 카테고리는 별도 테이블(`guests`)을 사용하므로 `categories`에 추가하지 않는다.
