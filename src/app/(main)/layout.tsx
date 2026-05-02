import { BottomNav } from "@/components/layout/bottom-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="pb-[72px]">{children}</main>
      <BottomNav />
    </>
  );
}
