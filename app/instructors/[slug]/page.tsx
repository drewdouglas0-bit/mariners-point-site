import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { instructors, getInstructor } from "../data";
import { InstructorAvatar } from "../../components/InstructorAvatar";

// Tell Next.js which slugs to pre-render at build time
export function generateStaticParams() {
  return instructors.map((i) => ({ slug: i.slug }));
}

// Per-page <title> and <meta description>
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const instructor = getInstructor(slug);
  if (!instructor) return {};
  return {
    title: `${instructor.name} — Mariners Point Golf`,
    description: instructor.headline,
  };
}

export default async function InstructorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const instructor = getInstructor(slug);
  if (!instructor) notFound();

  const {
    name, initials, headline, yearsTeaching, bio,
    quote, currentPackage, rateTables, ratesNote, scheduleLines,
    certifications, lessonIncludes, profileComingSoon,
    instagram, twitter, email, website, phone, primaryWebsiteCtaLabel,
  } = instructor;

  const bioParagraphs = bio.split("\n\n");
  const hasContact = !!(instagram || twitter || email || website || phone);
  const hasRates = rateTables.length > 0 || ratesNote;
  const websiteUrl = website
    ? website.startsWith("http://") || website.startsWith("https://")
      ? website
      : `https://${website}`
    : undefined;
  const websiteLabel = website
    ? website.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "";

  return (
    <main className="bg-night text-cream min-h-screen">

      {/* ── Back link ─────────────────────────────────────────────────── */}
      <div className="pt-20 border-b border-cream/10 bg-night">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            href="/instructors"
            className="inline-flex items-center gap-2 text-sm text-cream/45 hover:text-cream transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="7" x2="2" y2="7" />
              <polyline points="6 3 2 7 6 11" />
            </svg>
            All Instructors
          </Link>
        </div>
      </div>

      {/* ── Profile hero ──────────────────────────────────────────────── */}
      <div className="bg-navy py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <InstructorAvatar
              photo={instructor.photo}
              name={name}
              initials={initials}
              size="xl"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{name}</h1>
          <p className="text-cream/60 text-base leading-snug mb-4">{headline}</p>
          {profileComingSoon && (
            <div className="mb-4">
              <span className="inline-flex rounded-full border border-cream/20 bg-cream/5 px-3 py-1 text-[10px] uppercase tracking-widest text-cream/60">
                Profile coming soon
              </span>
            </div>
          )}
          <p className="text-gold text-xs tracking-[0.25em] uppercase">{yearsTeaching}</p>
        </div>
      </div>

      {/* ── Body: two-column ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

          {/* ── Main column: bio, quote, lesson includes ─────────────── */}
          <div className="lg:col-span-3 space-y-10">

            {/* Bio */}
            <div className="space-y-5">
              {bioParagraphs.map((para, i) => (
                <p key={i} className="text-cream/70 leading-relaxed text-base">
                  {para}
                </p>
              ))}
            </div>

            {/* Pull quote */}
            {quote && (
              <blockquote className="border-l-2 border-gold pl-6 py-1">
                <p className="text-lg italic text-cream/80 leading-relaxed">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <cite className="block text-sm text-cream/40 mt-3 not-italic">
                  — {quote.attribution}
                </cite>
              </blockquote>
            )}

            {/* What's included in a lesson */}
            {lessonIncludes && lessonIncludes.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/40 mb-5">
                  What&apos;s Included
                </h2>
                <ul className="space-y-3">
                  {lessonIncludes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-cream/65 leading-relaxed">
                      <span className="text-gold mt-0.5 flex-shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Sidebar: rates, schedule, certifications, contact ──────── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Current package callout */}
            {currentPackage && (
              <div className="border border-gold/40 bg-gold/[0.06] p-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold mb-4">
                  {currentPackage.label}
                </p>
                <div className="text-4xl font-bold text-gold leading-none mb-2">
                  {currentPackage.price}
                </div>
                <p className="text-cream/60 text-sm leading-relaxed">
                  {currentPackage.description}
                </p>
              </div>
            )}

            {/* Rates */}
            {hasRates && (
              <div>
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/40 mb-5">
                  Rates
                </h2>

                {rateTables.map((table, ti) => (
                  <div key={ti} className={ti > 0 ? "mt-6" : ""}>
                    {table.label && (
                      <p className="text-[11px] uppercase tracking-widest text-gold/70 mb-3">
                        {table.label}
                      </p>
                    )}
                    <div>
                      {table.rows.map((row, ri) => (
                        <div
                          key={ri}
                          className="flex justify-between items-center py-2.5 border-b border-cream/[0.07] text-sm"
                        >
                          <span className="text-cream/60">{row.duration}</span>
                          <span className="font-semibold text-cream">{row.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {ratesNote && (
                  <p className="text-cream/40 text-xs mt-4 leading-relaxed">
                    {ratesNote}
                  </p>
                )}
              </div>
            )}

            {/* Schedule */}
            {scheduleLines && scheduleLines.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/40 mb-5">
                  Schedule
                </h2>
                <div className="space-y-2">
                  {scheduleLines.map((line, i) => (
                    <p key={i} className="text-sm text-cream/65">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/40 mb-5">
                  Certifications
                </h2>
                <ul className="space-y-2.5">
                  {certifications.map((cert, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-cream/65">
                      <span className="text-gold mt-0.5 flex-shrink-0 text-xs">✦</span>
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {primaryWebsiteCtaLabel && websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center border border-gold bg-gold text-navy px-5 py-3 text-xs font-bold tracking-[0.12em] uppercase hover:bg-gold/90 transition-colors duration-200"
              >
                {primaryWebsiteCtaLabel}
              </a>
            )}

            {/* Contact */}
            {hasContact && (
              <div>
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/40 mb-5">
                  Contact
                </h2>
                <div className="space-y-3">
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-3 text-sm text-cream/65 hover:text-gold transition-colors duration-200"
                    >
                      <span className="text-gold flex-shrink-0">→</span>
                      {email}
                    </a>
                  )}
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/[^0-9]/g, "")}`}
                      className="flex items-center gap-3 text-sm text-cream/65 hover:text-gold transition-colors duration-200"
                    >
                      <span className="text-gold flex-shrink-0">→</span>
                      {phone}
                    </a>
                  )}
                  {website && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-cream/65 hover:text-gold transition-colors duration-200"
                    >
                      <span className="text-gold flex-shrink-0">→</span>
                      {websiteLabel}
                    </a>
                  )}
                  {twitter && (
                    <a
                      href={`https://x.com/${twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-cream/65 hover:text-gold transition-colors duration-200"
                    >
                      <span className="text-gold flex-shrink-0">→</span>
                      @{twitter}
                    </a>
                  )}
                  {instagram && (
                    <a
                      href={`https://instagram.com/${instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-cream/65 hover:text-gold transition-colors duration-200"
                    >
                      <span className="text-gold flex-shrink-0">→</span>
                      @{instagram}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Booking nudge */}
            <div className="border border-cream/10 p-6">
              <p className="text-sm text-cream/55 leading-relaxed mb-4">
                Ready to book a lesson with {name.split(" ")[0]}?
              </p>
              <a
                href="tel:6505737888"
                className="inline-flex items-center gap-3 text-gold text-xs font-bold tracking-[0.2em] uppercase"
              >
                <span className="w-6 h-px bg-gold" />
                (650) 573-7888
              </a>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
