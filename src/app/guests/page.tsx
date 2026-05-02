"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { GuestStats } from "@/components/guests/guest-stats";
import { SideSummary } from "@/components/guests/side-summary";
import { GuestTabs } from "@/components/guests/guest-tabs";
import { GuestList } from "@/components/guests/guest-list";
import { GuestModal } from "@/components/modals/guest-modal";
import { MOCK_GUESTS } from "@/lib/mock-data";

export default function GuestsPage() {
  const [tab, setTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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
