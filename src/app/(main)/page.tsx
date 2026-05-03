"use client";

import { BellIcon, MenuIcon } from "@/components/ui/icons";
import { CategoryTabs } from "@/components/layout/category-tabs";
import { HeroSection } from "@/components/home/hero-section";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { useCouple } from "@/hooks/use-couple";
import { useEvents } from "@/hooks/use-events";

export default function HomePage() {
  const { couple, heroImage, updateCouple, updateMessage, uploadHeroImage } = useCouple();
  const { events } = useEvents();

  const upcoming = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <>
      <div className="px-5 py-3 flex items-center justify-between flex-shrink-0">
        <h1 className="text-lg font-bold m-0 flex items-center gap-1.5">
          <img src="/icons/logo.png" alt="숲인" className="w-6 h-6 rounded-sm object-contain" />
          숲인
        </h1>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center border-none cursor-pointer">
            <BellIcon width={18} height={18} />
          </button>
          <button className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center border-none cursor-pointer">
            <MenuIcon width={18} height={18} />
          </button>
        </div>
      </div>

      <CategoryTabs />

      <HeroSection couple={couple} heroImage={heroImage} onUpdateCouple={updateCouple} onUpdateMessage={updateMessage} onUploadImage={uploadHeroImage} />
      <UpcomingEvents events={upcoming} />
    </>
  );
}
