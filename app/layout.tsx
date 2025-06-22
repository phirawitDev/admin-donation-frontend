import type { Metadata } from "next";
import "./globals.css";

import { Sarabun } from "next/font/google";

const prompt = Sarabun({
  subsets: ["thai"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "กองบุญออนไลน์ | วิหารพระโพธิสัตว์กวนอิมทุ่งพิชัย",
  description: "ระบบกองบุญออนไลน์ วิหารพระโพธิสัตว์กวนอิมทุ่งพิชัย",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={prompt.className}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className="body w-screen min-h-screen bg-base-300">{children}</body>
    </html>
  );
}
