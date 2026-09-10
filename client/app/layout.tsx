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
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="44" height="44" rx="12" fill="%238e81e7"/><g transform="translate(22, 21) scale(2.35) translate(-12, -11.5)"><path d="M6 19.5V10.2a6 6 0 0 1 12 0v9.3l-2.2-1.4-2.1 1.4-2.1-1.4-2.1 1.4-2.1-1.4-1.4.9Z" fill="%23364153"/><circle cx="9.4" cy="11.2" r="1.05" fill="white"/><circle cx="14.6" cy="11.2" r="1.05" fill="white"/><path d="M10 14.2c.8.7 1.6.7 2.4 0 .8.7 1.6.7 2.4 0" stroke="white" stroke-width="1.2" stroke-linecap="round" fill="none"/></g></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
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
