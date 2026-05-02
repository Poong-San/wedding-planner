"use client";

import { useRouter } from "next/navigation";
import { ChevLeftIcon, MoreIcon } from "@/components/ui/icons";

interface CategoryHeroProps {
  name: string;
}

export function CategoryHero({ name }: CategoryHeroProps) {
  const router = useRouter();

  return (
    <div
      className="h-[200px] relative flex-shrink-0 flex items-center justify-center text-[11px]"
      style={{
        background: "repeating-linear-gradient(45deg, #f5e8e0, #f5e8e0 8px, #fdf9f3 8px, #fdf9f3 16px)",
        color: "rgba(180,140,90,0.7)",
      }}
    >
      {name} 이미지
      <button
        onClick={() => router.back()}
        className="absolute top-[38px] left-3.5 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center border-none cursor-pointer"
      >
        <ChevLeftIcon width={18} height={18} />
      </button>
      <button className="absolute top-[38px] right-3.5 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center border-none cursor-pointer">
        <MoreIcon width={18} height={18} />
      </button>
    </div>
  );
}
