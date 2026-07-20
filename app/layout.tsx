import type { Metadata } from "next";
import "../src/styles.css";

export const metadata: Metadata = {
  title: "TeiVF | Match Moments",
  description: "Live yes-or-no sports moments on TeiVF.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "64x64" }
    ],
    shortcut: "/favicon.ico",
    apple: "/tei-velocity-mark.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
