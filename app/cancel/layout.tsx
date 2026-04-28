import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancel Booking — Mariners Point Golf Center",
  description: "Cancel your tee time reservation at Mariners Point Golf Center.",
  robots: "noindex",
};

export default function CancelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
