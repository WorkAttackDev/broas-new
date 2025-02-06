import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header";
import QueryProvider from "./query-provider";
import { GoogleAnalytics } from "@next/third-parties/google";

const comfortaa = Comfortaa({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Broas",
  description: "Encontre aqui as melhores broas",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${comfortaa.variable} antialiased font-sans bg-slate-100`}
      >
        <QueryProvider>
          <Header />
          {children}
          <Toaster richColors position="top-center" closeButton />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
        </QueryProvider>
      </body>
    </html>
  );
}
