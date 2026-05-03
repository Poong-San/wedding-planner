"use client";

import { useRouter } from "next/navigation";
import { ChevLeftIcon, MenuIcon } from "@/components/ui/icons";

interface CategoryHeroProps {
  name: string;
}

export function CategoryHero({ name }: CategoryHeroProps) {
  const router = useRouter();

  return (
    <div className="h-[52px] relative flex-shrink-0 flex items-center justify-center bg-white border-b border-ink-200">
      <h1 className="text-[16px] font-bold m-0">{name}</h1>

      <button
        onClick={() => router.back()}
        className="absolute left-3.5 w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer bg-transparent"
      >
        <ChevLeftIcon width={20} height={20} />
      </button>

      {/* 메뉴 */}
      <button className="absolute right-3.5 w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer bg-transparent">
        <MenuIcon width={20} height={20} />
      </button>
    </div>
  );
}
