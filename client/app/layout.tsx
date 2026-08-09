import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@livekit/components-styles";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ghost Call — Anonymous Video Calls",
  description: "Make private video calls with no sign-up, no login, no personal data. Share a link or code and connect instantly.",
  keywords: ["ghost call", "anonymous video call", "private video call", "no login video call"],
  openGraph: {
    title: "Ghost Call — Anonymous Video Calls",
    description: "No sign-up. No personal data. Just share a link and call.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
