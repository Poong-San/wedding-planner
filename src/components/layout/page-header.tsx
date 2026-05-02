"use client";

import { useRouter } from "next/navigation";
import { ChevLeftIcon } from "@/components/ui/icons";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: (() => void) | false;
  right?: React.ReactNode;
}

export function PageHeader({ title, subtitle, onBack, right }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = onBack === false
    ? undefined
    : onBack || (() => router.back());

  return (
    <div className="px-5 py-3 flex items-center justify-between flex-shrink-0">
      {handleBack ? (
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center border-none cursor-pointer"
        >
          <ChevLeftIcon width={18} height={18} />
        </button>
      ) : (
        <div className="w-9" />
      )}
      <div className={`flex-1 ${handleBack ? "text-center" : "text-left ml-1"}`}>
        <h1 className="text-base font-bold m-0 tracking-tight">{title}</h1>
        {subtitle && (
          <div className="text-[11px] text-ink-500">{subtitle}</div>
        )}
      </div>
      {right || <div className="w-9" />}
    </div>
  );
}
