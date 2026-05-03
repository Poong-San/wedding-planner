"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevLeftIcon, MoreIcon } from "@/components/ui/icons";

interface CategoryHeroProps {
  name: string;
  categoryType: string;
}

export function CategoryHero({ name, categoryType }: CategoryHeroProps) {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`category_image_${categoryType}`);
    if (saved) setHeroImage(saved);
  }, [categoryType]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setHeroImage(dataUrl);
      localStorage.setItem(`category_image_${categoryType}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const stripedBg = "repeating-linear-gradient(45deg, #f5e8e0, #f5e8e0 8px, #fdf9f3 8px, #fdf9f3 16px)";

  return (
    <div
      className="h-[200px] relative flex-shrink-0 flex items-center justify-center text-[11px]"
      style={
        heroImage
          ? { backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }
          : { background: stripedBg, color: "rgba(180,140,90,0.7)" }
      }
    >
      {!heroImage && <span>{name} 이미지</span>}

      {/* 이미지 업로드 오버레이 버튼 */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute top-[38px] left-14 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center border-none cursor-pointer text-[16px]"
        aria-label="카테고리 이미지 업로드"
      >
        📷
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

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
