import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
