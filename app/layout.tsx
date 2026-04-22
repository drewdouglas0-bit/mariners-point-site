import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Lora } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mariners Point Golf Center — Foster City, CA",
  description:
    "A 9-hole par-3 course and 64-stall driving range on San Francisco Bay. Lighted for night play until 10 PM, seven days a week.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${lora.variable} h-full`}>
      <body className="min-h-full">
        <div className="hidden sm:block fixed top-0 inset-x-0 z-[60] h-9 border-b border-cream/10 bg-night/85 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between text-[11px] tracking-[0.06em] uppercase text-cream/65">
            <div className="flex items-center gap-5">
              <a
                href="tel:6505737888"
                className="hover:text-cream transition-colors duration-200"
              >
                (650) 573-7888
              </a>
              <a
                href="mailto:info@marinerspoint.com"
                className="inline-flex items-center gap-2 hover:text-cream transition-colors duration-200"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="1.5" y="2.5" width="11" height="9" rx="1.6" />
                  <path d="M2.2 3.2 7 7l4.8-3.8" />
                </svg>
                info@marinerspoint.com
              </a>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/p/Mariners-Point-Golf-and-Practice-Center-100053555150047/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mariners Point on Facebook"
                className="text-cream/60 hover:text-cream transition-colors duration-200"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 8h-2a3 3 0 0 0-3 3v3H8v3h2v5h3v-5h2.2l.8-3H13v-2a1 1 0 0 1 1-1h2V8Z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/marinerspoint/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mariners Point on Instagram"
                className="text-cream/60 hover:text-cream transition-colors duration-200"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="sm:pt-9">{children}</div>
      </body>
    </html>
  );
}
