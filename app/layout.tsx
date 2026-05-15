import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/providers/language-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coach Faisal Padel Performance Lab",
  description: "Premium padel coaching assessment and player development reports.",
  icons: {
    icon: "/logo/favicon.png",
    apple: "/logo/app-logo-icon.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B1820"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
