import type { Metadata } from "next";
import "../src/styles.css";

export const metadata: Metadata = {
  title: "TeiVF | Match Moments",
  description: "Live yes-or-no sports moments on TeiVF."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
