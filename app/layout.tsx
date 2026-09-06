import type { Metadata } from "next";
import { Fraunces, Hind_Siliguri, Plus_Jakarta_Sans } from "next/font/google";
import { Aurora } from "@/components/layout/Aurora";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Providers } from "@/components/providers";
import { skipClass } from "@/lib/styles";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["400", "600"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bidyapith University — Admission, study and results in one place",
  description:
    "Bidyapith University runs admission, course registration, attendance, results and fees on a single system. Explore 34 programmes across six schools in Dhaka.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${fraunces.variable} ${plusJakarta.variable} ${hindSiliguri.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <a href="#main" className={skipClass}>
            Skip to content
          </a>
          <Aurora />
          <SiteHeader />
          <div className="flex-1 flex flex-col">{children}</div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
