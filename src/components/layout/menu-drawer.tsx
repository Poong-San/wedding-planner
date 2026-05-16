"use client";

import { useRouter } from "next/navigation";
import { WalletIcon } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/client";

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const router = useRouter();

  if (!open) return null;

  const handleNav = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/40"
      />
      {/* 드로어 */}
      <div className="fixed top-0 right-0 bottom-0 z-[101] w-[280px] max-w-[80vw] bg-white shadow-xl flex flex-col">
        <div className="px-5 py-4 border-b border-ink-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/icons/logo.png" alt="숲인" className="w-7 h-7 object-contain" />
            <span className="text-[15px] font-bold">숲인</span>
          </div>
          <button
            onClick={onClose}
            className="text-[18px] text-ink-500 bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <MenuItem
            icon={<WalletIcon width={18} height={18} />}
            label="예산관리"
            onClick={() => handleNav("/budget")}
          />
          <MenuItem
            icon={<span className="text-[15px]">⚙️</span>}
            label="설정"
            onClick={() => handleNav("/settings")}
          />
        </div>

        <div className="px-2 py-3 border-t border-ink-200">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-3 text-left text-[13px] text-red-500 font-medium bg-transparent border-none cursor-pointer rounded-lg hover:bg-red-50"
          >
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-5 py-3 flex items-center gap-3 text-left text-[14px] font-medium text-ink-700 bg-transparent border-none cursor-pointer hover:bg-ink-50"
    >
      <span className="w-6 flex items-center justify-center">{icon}</span>
      {label}
    </button>
  );
}
