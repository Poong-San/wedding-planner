"use client";

import React, { use, useState } from "react";
import { CategoryHero } from "@/components/category/category-hero";
import { ProgressStepper } from "@/components/category/progress-stepper";
import { InfoCards } from "@/components/category/info-cards";
import { PaymentTimeline } from "@/components/category/payment-timeline";
import { CategoryInfo } from "@/components/category/category-info";
import { FieldList } from "@/components/category/field-list";
import { FieldInputModal } from "@/components/category/field-input-modal";
import { CategoryEditModal } from "@/components/modals/category-edit-modal";
import { PinIcon } from "@/components/ui/icons";
import { GuestStats } from "@/components/guests/guest-stats";
import { SideSummary } from "@/components/guests/side-summary";
import { GuestTabs } from "@/components/guests/guest-tabs";
import { GuestList } from "@/components/guests/guest-list";
import { GuestModal } from "@/components/modals/guest-modal";
import { useCategories } from "@/hooks/use-categories";
import { useGuests } from "@/hooks/use-guests";
import { useEvents } from "@/hooks/use-events";
import { MAIN_TAB_LABELS, SUB_CATEGORIES, STATUS_LABELS, getStatusChipClass } from "@/lib/constants";
import { formatTime } from "@/lib/utils";
import type { MainTabType, CategoryType, CategoryField, FieldType } from "@/types";

/* ─── 하객 전용 뷰 ─── */
function GuestsView() {
  const [tab, setTab] = React.useState("all");
  const [showModal, setShowModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | string | null>(null);
  const { guests, addGuest, updateGuest, deleteGuest } = useGuests();
  const filtered = guests.filter((g) => tab === "all" || g.side === tab);
  const groomGuests = guests.filter((g) => g.side === "groom");
  const brideGuests = guests.filter((g) => g.side === "bride");
  const mealCount = guests.filter((g) => g.meal).length;
  const giftSum = guests.reduce((s, g) => s + (g.gift || 0), 0);
  const selectedGuest = selectedId ? guests.find((g) => g.id === selectedId) : undefined;

  return (
    <div className="pb-[90px]">
      <GuestStats mealCount={mealCount} giftSum={giftSum} />
      <SideSummary
        groomCount={groomGuests.length} groomAtt={groomGuests.filter((g) => g.att === "attending").length} groomUnd={groomGuests.filter((g) => g.att === "undecided").length}
        brideCount={brideGuests.length} brideAtt={brideGuests.filter((g) => g.att === "attending").length} brideUnd={brideGuests.filter((g) => g.att === "undecided").length}
      />
      <GuestTabs tab={tab} onTabChange={setTab} totalCount={guests.length} groomCount={groomGuests.length} brideCount={brideGuests.length} />
      <GuestList guests={filtered} onGuestClick={(id) => setSelectedId(id)} />
      <div className="px-5 pt-2">
        <button onClick={() => setShowModal(true)} className="w-full py-3 border border-dashed border-ink-300 rounded-xl text-[13px] text-ink-500 font-medium cursor-pointer bg-white font-sans">+ 하객 추가</button>
      </div>
      {showModal && <GuestModal onClose={() => setShowModal(false)} onSave={(data) => addGuest(data)} />}
      {selectedGuest && <GuestModal guest={selectedGuest} onClose={() => setSelectedId(null)} onSave={(data) => updateGuest(selectedGuest.id, data)} onDelete={(id) => { deleteGuest(id); setSelectedId(null); }} />}
    </div>
  );
}

/* ─── 단일 카테고리 상세 뷰 ─── */
function CategoryDetailView({ catType }: { catType: CategoryType }) {
  const { categories, fields, loading, addField, updateField, deleteField, updateCategory, addPayment, togglePayment } = useCategories();
  const { events } = useEvents();
  const [editingField, setEditingField] = useState<CategoryField | null>(null);
  const [showCategoryEdit, setShowCategoryEdit] = useState(false);

  const cat = categories[catType];

  if (loading || !cat) {
    return <div className="flex items-center justify-center py-20"><div className="text-[13px] text-ink-400">불러오는 중...</div></div>;
  }

  // 하객은 전용 뷰
  if (catType === "guests") return <GuestsView />;

  const relatedEvents = events.filter((e) => e.cat === catType).sort((a, b) => a.date.localeCompare(b.date));
  const categoryFields = fields[catType] || [];

  return (
    <div className="pb-[90px]">
      <div className="px-5 pt-[18px] pb-1">
        <div className="flex items-center justify-between mb-2">
          <span className={`chip ${getStatusChipClass(cat.status)}`}>{STATUS_LABELS[cat.status]}</span>
          <button onClick={() => setShowCategoryEdit(true)} className="text-[12px] text-green-600 font-medium bg-transparent border-none cursor-pointer">✎ 수정</button>
        </div>
        <h2 className="text-xl font-bold mt-0 mb-1">{cat.vendor || `${cat.name} (업체 미정)`}</h2>
        {cat.address && <div className="flex items-center gap-1.5 text-xs text-ink-500"><PinIcon width={12} height={12} /> {cat.address}</div>}
      </div>

      <ProgressStepper status={cat.status} onStatusChange={(s) => updateCategory(catType, { status: s })} />
      <InfoCards category={cat} />
      <PaymentTimeline payments={cat.payments} onToggle={(idx) => togglePayment(catType, idx)} />
      <CategoryInfo category={cat} onEdit={() => setShowCategoryEdit(true)} />
      <FieldList fields={categoryFields} onFieldClick={(f) => setEditingField(f)} onDelete={(id) => deleteField(catType, id)} />

      {relatedEvents.length > 0 && (
        <div className="px-5 pb-4">
          <div className="text-[11px] text-ink-500 uppercase tracking-wider font-medium mb-2.5">관련 일정 ({relatedEvents.length})</div>
          {relatedEvents.map((e) => (
            <div key={e.id} className="card mb-1.5 flex items-center gap-3 p-3 cursor-pointer">
              <div className="w-9 text-center pr-2.5 border-r border-ink-200">
                <div className="text-[10px] text-ink-500">{e.date.slice(5, 7)}월</div>
                <div className="text-sm font-bold">{e.date.slice(8)}</div>
              </div>
              <div className="flex-1 text-xs font-medium">{e.title}</div>
              <div className="text-[11px] text-ink-500">{formatTime(e.time)}</div>
            </div>
          ))}
        </div>
      )}

      {editingField && (
        <FieldInputModal
          definition={{ key: editingField.fieldKey, label: editingField.fieldLabel, type: editingField.fieldType as FieldType, options: editingField.fieldOptions ? editingField.fieldOptions.split(",") : undefined }}
          initialValue={editingField.fieldValue}
          onSave={(data) => updateField(catType, editingField.id, data.value)}
          onClose={() => setEditingField(null)}
        />
      )}
      {showCategoryEdit && (
        <CategoryEditModal
          category={cat} categoryType={catType}
          onSave={(updates) => updateCategory(catType, updates)}
          onAddPayment={(p) => addPayment(catType, p)}
          onAddField={(d) => addField(catType, d)}
          onClose={() => setShowCategoryEdit(false)}
        />
      )}
    </div>
  );
}

/* ─── 메인 페이지 ─── */
export default function CategoryPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const mainTabType = type as MainTabType;
  const subCategories = SUB_CATEGORIES[mainTabType];
  const mainTabName = MAIN_TAB_LABELS[mainTabType];

  // 세부 카테고리가 없는 경우 (웨딩홀, 허니문) → 바로 상세 뷰
  const isSingleCategory = !subCategories || subCategories.length === 0;
  const [activeSubTab, setActiveSubTab] = useState(0);

  // 단독 카테고리
  if (isSingleCategory) {
    return (
      <>
        <CategoryHero name={mainTabName || type} />
        <CategoryDetailView catType={type as CategoryType} />
      </>
    );
  }

  // 세부 카테고리가 있는 경우
  const currentSub = subCategories[activeSubTab];

  return (
    <>
      <CategoryHero name={mainTabName || type} />

      {/* 서브 카테고리 탭 */}
      <div className="flex border-b border-ink-200 px-2 overflow-x-auto scrollbar-hide">
        {subCategories.map((sub, i) => (
          <button
            key={sub.type}
            onClick={() => setActiveSubTab(i)}
            className={`flex-shrink-0 px-3.5 py-2.5 text-[13px] font-medium whitespace-nowrap border-none cursor-pointer font-sans bg-transparent ${
              i === activeSubTab
                ? "text-ink-900 border-b-2 !border-b-green-500"
                : "text-ink-400"
            }`}
            style={i === activeSubTab ? { borderBottom: "2px solid #22c55e" } : undefined}
          >
            {sub.name}
          </button>
        ))}
      </div>

      <CategoryDetailView catType={currentSub.type} />
    </>
  );
}
