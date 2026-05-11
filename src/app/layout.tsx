import type { Metadata, Viewport } from "next";
import { SplashScreen } from "@/components/splash-screen";
import { NextAuthSessionProvider } from "@/components/session-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "숲인",
  description: "결혼 준비를 함께 관리하는 앱",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "숲인",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="mx-auto max-w-[480px] min-h-dvh bg-white relative">
          <NextAuthSessionProvider>
            <SplashScreen>
              {children}
            </SplashScreen>
          </NextAuthSessionProvider>
        </div>
      </body>
    </html>
  );
}
