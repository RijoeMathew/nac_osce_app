import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NAC OSCE Helper",
  description: "AI-powered Canada NAC OSCE practice platform"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
