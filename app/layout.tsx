import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

export const metadata: Metadata = {
  title: "Y Sujith | Autonomous AI Robot Portfolio",
  description:
    "Interactive AI Agent Operating System and Developer Portfolio for Y Sujith (ysujith728). Specializing in Autonomous AI, Embedded Robotics, Visual SLAM, and High-Performance Systems.",
  keywords: [
    "Y Sujith",
    "ysujith728",
    "AI Engineer",
    "Autonomous Robotics",
    "SLAM",
    "Webots",
    "Arduino",
    "Next.js",
    "Three.js",
    "Portfolio",
  ],
  authors: [{ name: "Y Sujith", url: "https://github.com/ysujith728" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 min-h-screen selection:bg-cyan-500 selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
