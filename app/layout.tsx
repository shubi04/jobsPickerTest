import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "JobsPicker - Find Your Dream Job",
  description:
    "Connect with top employers and find the perfect job opportunity. JobsPicker makes job hunting simple and effective.",
  keywords: ["jobs", "career", "employment", "hiring", "job board"],
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
