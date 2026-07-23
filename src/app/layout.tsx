import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PosterForge - Free Privacy-First Online Poster Tiler & PDF Exporter",
  description: "Split any large image into a multi-page printable poster PDF. 100% Free, no login required, zero server uploads. High-resolution client-side canvas processing.",
  keywords: ["poster tiler", "print tiler alternative", "split image into pages", "poster separator", "tile printer", "printable poster maker"],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
