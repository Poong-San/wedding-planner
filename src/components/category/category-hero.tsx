"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevLeftIcon, MoreIcon } from "@/components/ui/icons";

interface CategoryHeroProps {
  name: string;
  imageUrl: string | null;
  onUploadImage?: (file: File) => void;
}

export function CategoryHero({ name, imageUrl, onUploadImage }: CategoryHeroProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;
    setUploading(true);
    await onUploadImage(file);
    setUploading(false);
  };

  const stripedBg = "repeating-linear-gradient(45deg, #f5e8e0, #f5e8e0 8px, #fdf9f3 8px, #fdf9f3 16px)";

  return (
    <div
      className="h-[200px] relative flex-shrink-0 flex items-center justify-center text-[11px]"
      style={
        imageUrl
          ? { backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
          : { background: stripedBg, color: "rgba(180,140,90,0.7)" }
      }
    >
      {!imageUrl && <span>{name} 이미지</span>}

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="absolute top-[38px] left-14 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center border-none cursor-pointer text-[16px] disabled:opacity-50"
        aria-label="카테고리 이미지 업로드"
      >
        {uploading ? "⏳" : "📷"}
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
