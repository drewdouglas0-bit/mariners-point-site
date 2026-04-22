import type { Metadata } from "next";
import Link from "next/link";
import { instructors } from "./data";
import { InstructorAvatar } from "../components/InstructorAvatar";

export const metadata: Metadata = {
  title: "Instructors — Mariners Point Golf Center",
  description:
    "Meet the teaching professionals at Mariners Point. Nine PGA-certified instructors for all skill levels — private lessons, group clinics, and junior programs.",
};

export default function InstructorsPage() {
  return (
    <main className="bg-night text-cream min-h-screen">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="bg-navy pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold tracking-[0.25em] text-xs uppercase mb-4">
            Mariners Point Golf Center
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Instructors</h1>
          <p className="text-cream/55 text-base max-w-xl leading-relaxed">
            Nine PGA-certified teaching professionals, each with a distinct
            background and method. All skill levels — beginner through
            accomplished — find instruction here.
          </p>
        </div>
      </div>

      {/* ── Instructor grid ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((instructor) => (
            <Link
              key={instructor.slug}
              href={`/instructors/${instructor.slug}`}
              className="group block border border-cream/10 p-8 hover:border-cream/25 transition-colors duration-200"
            >
              {/* Avatar */}
              <InstructorAvatar
                photo={instructor.photo}
                name={instructor.name}
                initials={instructor.initials}
                size="md"
              />

              {/* Name */}
              <h2 className="text-xl font-bold mt-5 mb-1 group-hover:text-gold transition-colors duration-200">
                {instructor.name}
              </h2>

              {/* Headline — clamp to 2 lines */}
              <p className="text-cream/55 text-sm leading-snug line-clamp-2">
                {instructor.headline}
              </p>

              {/* Years */}
              <p className="text-gold/70 text-xs tracking-widest uppercase mt-4">
                {instructor.yearsTeaching}
              </p>

              {/* CTA */}
              <div className="mt-6 flex items-center gap-2 text-xs text-cream/40 group-hover:text-gold transition-colors duration-200">
                <span className="w-5 h-px bg-current" />
                <span>View profile</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Footer note ───────────────────────────────────────────────── */}
      <div className="border-t border-cream/10 py-10 px-6 text-center">
        <p className="text-cream/35 text-sm">
          To book a lesson, call{" "}
          <a
            href="tel:6505737888"
            className="text-cream/55 hover:text-gold transition-colors"
          >
            (650) 573-7888
          </a>{" "}
          or contact your instructor directly from their profile.
        </p>
      </div>
    </main>
  );
}
