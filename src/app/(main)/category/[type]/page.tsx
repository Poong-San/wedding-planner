"use client";

import React, { use } from "react";
import { CategoryHero } from "@/components/category/category-hero";
import { ProgressStepper } from "@/components/category/progress-stepper";
import { InfoCards } from "@/components/category/info-cards";
import { PaymentTimeline } from "@/components/category/payment-timeline";
import { CategoryInfo } from "@/components/category/category-info";
import { PhoneIcon, PinIcon, PlusIcon } from "@/components/ui/icons";
import { GuestStats } from "@/components/guests/guest-stats";
import { SideSummary } from "@/components/guests/side-summary";
import { GuestTabs } from "@/components/guests/guest-tabs";
import { GuestList } from "@/components/guests/guest-list";
import { GuestModal } from "@/components/modals/guest-modal";
import { STATUS_LABELS, getStatusChipClass, CATEGORY_LABELS } from "@/lib/constants";
import { MOCK_CATEGORIES, MOCK_EVENTS, MOCK_GUESTS } from "@/lib/mock-data";
import type { CategoryType } from "@/types";

function GuestsView() {
  const [tab, setTab] = React.useState("all");
  const [showModal, setShowModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const guests = MOCK_GUESTS;
  const filtered = guests.filter((g) => tab === "all" || g.side === tab);

  const groomGuests = guests.filter((g) => g.side === "groom");
  const brideGuests = guests.filter((g) => g.side === "bride");
  const mealCount = guests.filter((g) => g.meal).length;
  const giftSum = guests.reduce((s, g) => s + (g.gift || 0), 0);

  const selectedGuest = selectedId ? guests.find((g) => g.id === selectedId) : undefined;

  return (
    <>
      <div className="px-5 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold m-0">하객관리</h1>
        <button onClick={() => setShowModal(true)}
          className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center border-none cursor-pointer">
          <PlusIcon width={18} height={18} />
        </button>
      </div>

      <GuestStats mealCount={mealCount} giftSum={giftSum} />

      <SideSummary
        groomCount={groomGuests.length}
        groomAtt={groomGuests.filter((g) => g.att === "attending").length}
        groomUnd={groomGuests.filter((g) => g.att === "undecided").length}
        brideCount={brideGuests.length}
        brideAtt={brideGuests.filter((g) => g.att === "attending").length}
        brideUnd={brideGuests.filter((g) => g.att === "undecided").length}
      />

      <GuestTabs
        tab={tab} onTabChange={setTab}
        totalCount={guests.length}
        groomCount={groomGuests.length}
        brideCount={brideGuests.length}
      />

      <GuestList guests={filtered} onGuestClick={(id) => setSelectedId(id)} />

      {showModal && <GuestModal onClose={() => setShowModal(false)} />}
      {selectedGuest && (
        <GuestModal guest={selectedGuest} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
}

export default function CategoryPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);

  if (type === "guests") {
    return <GuestsView />;
  }

  const cat = MOCK_CATEGORIES[type as CategoryType];

  if (!cat) {
    return (
      <div className="p-5">
        <p>카테고리를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const relatedEvents = MOCK_EVENTS
    .filter((e) => e.cat === type)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <CategoryHero name={cat.name} />

      <div className="pb-[90px]">
        <div className="px-5 pt-[18px] pb-1">
          <span className={`chip ${getStatusChipClass(cat.status)}`}>
            {STATUS_LABELS[cat.status]}
          </span>
          <h2 className="text-xl font-bold mt-2.5 mb-1">
            {cat.vendor || `${cat.name} (업체 미정)`}
          </h2>
          {cat.address && (
            <div className="flex items-center gap-1.5 text-xs text-ink-500">
              <PinIcon width={12} height={12} /> {cat.address}
            </div>
          )}
        </div>

        <ProgressStepper status={cat.status} />
        <InfoCards category={cat} />

        {cat.contact && cat.contact !== "-" && (
          <div className="px-5 pb-4 flex gap-2">
            <button className="btn-secondary flex-1 flex items-center justify-center gap-1.5">
              <PhoneIcon width={14} height={14} /> 전화
            </button>
            <button className="btn-secondary flex-1 flex items-center justify-center gap-1.5">
              <PinIcon width={14} height={14} /> 길찾기
            </button>
          </div>
        )}

        <PaymentTimeline payments={cat.payments} />
        <CategoryInfo category={cat} />

        {relatedEvents.length > 0 && (
          <div className="px-5 pb-4">
            <div className="text-[11px] text-ink-500 uppercase tracking-wider font-medium mb-2.5">
              관련 일정 ({relatedEvents.length})
            </div>
            {relatedEvents.map((e) => (
              <div key={e.id} className="card mb-1.5 flex items-center gap-3 p-3 cursor-pointer">
                <div className="w-9 text-center pr-2.5 border-r border-ink-200">
                  <div className="text-[10px] text-ink-500">{e.date.slice(5, 7)}월</div>
                  <div className="text-sm font-bold">{e.date.slice(8)}</div>
                </div>
                <div className="flex-1 text-xs font-medium">{e.title}</div>
                <div className="text-[11px] text-ink-500">{e.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
