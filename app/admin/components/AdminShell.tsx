"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

const navItems = [
  { href: "/admin", label: "Today" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/tee-sheet", label: "Tee Sheet" },
  { href: "/admin/block-times", label: "Block Times" },
  { href: "/admin/flagged-golfers", label: "Flagged Golfers" },
];

export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 md:flex">
      <aside className="w-full md:w-64 md:min-h-screen bg-slate-900 text-slate-100 p-4 md:p-5">
        <p className="text-xs uppercase tracking-wide text-slate-400">Mariners Point</p>
        <h1 className="mt-1 text-lg font-semibold">Pro Shop Admin</h1>

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm ${
                  active ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="mt-8 w-full rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-60"
        >
          {signingOut ? "Signing out..." : "Sign Out"}
        </button>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
}
