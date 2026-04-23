"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookingPanel } from "./components/BookingPanel";

// ─── Data ────────────────────────────────────────────────────────────────────

const greenFees = [
  { name: "Weekday (Mon – Fri)", price: "$18" },
  { name: "Weekend / Holiday", price: "$24" },
  { name: "Twilight (after 6 PM)", price: "$15" },
  { name: "Junior (under 18)", price: "$12" },
  { name: "Senior (65+)", price: "$14" },
];

const rangeBuckets = [
  { name: "Small · 40 balls", price: "$10" },
  { name: "Medium · 80 balls", price: "$17" },
  { name: "Large · 120 balls", price: "$23" },
  { name: "Jumbo · 180 balls", price: "$32" },
  { name: "Toptracer upgrade", price: "+$5" },
];

const hours = [
  { day: "Monday", time: "10:00 AM – 10:00 PM" },
  { day: "Tuesday – Saturday", time: "7:30 AM – 10:00 PM" },
  { day: "Sunday", time: "7:30 AM – 9:00 PM" },
];

const courseStats = [
  { label: "Format", value: "9 Holes", sub: "Par 27" },
  { label: "Total Yardage", value: "1,233", sub: "Yards" },
  { label: "Architect", value: "Bob Cupp", sub: "Est. 1996" },
  { label: "Difficulty", value: "All Levels", sub: "Par-3 Layout" },
  { label: "Setting", value: "Bayside", sub: "Foster City, CA" },
  { label: "Night Play", value: "Until 10 PM", sub: "7 Days a Week" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    ["About", "#about"],
    ["The Course", "#course"],
    ["Practice", "#practice"],
    ["Lessons", "#lessons"],
    ["Community", "#community"],
    ["Birdie's", "#birdies"],
    ["Rates", "#rates"],
    ["Contact", "#contact"],
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openBookingPanel = () => {
    setMenuOpen(false);
    setPanelOpen(true);
  };

  const toggleMobileMenu = () => {
    if (panelOpen) {
      setMenuOpen(false);
      return;
    }
    setMenuOpen((m) => !m);
  };

  return (
    <main className="bg-night text-cream overflow-x-clip">
      <BookingPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 sm:top-9 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-night/95 backdrop-blur-md border-b border-cream/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <a
            href="#"
            className="text-gold font-semibold tracking-[0.15em] uppercase text-xs sm:text-sm min-h-[44px] inline-flex items-center"
          >
            Mariners Point
          </a>

          <nav className="hidden sm:flex gap-6 md:gap-8 text-xs uppercase tracking-[0.15em] text-cream/70">
            {navLinks.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="hover:text-gold transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={openBookingPanel}
              className="bg-gold text-night text-[11px] sm:text-xs font-bold tracking-widest uppercase px-3.5 sm:px-5 min-h-[44px] hover:bg-gold-light transition-colors duration-200"
            >
              Book a Tee Time
            </button>
            <button
              onClick={toggleMobileMenu}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              className="sm:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center border border-cream/25 text-cream"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                {menuOpen ? (
                  <>
                    <line x1="3" y1="3" x2="15" y2="15" />
                    <line x1="15" y1="3" x2="3" y2="15" />
                  </>
                ) : (
                  <>
                    <line x1="2.5" y1="4.5" x2="15.5" y2="4.5" />
                    <line x1="2.5" y1="9" x2="15.5" y2="9" />
                    <line x1="2.5" y1="13.5" x2="15.5" y2="13.5" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
        <div
          className={`sm:hidden border-t border-cream/10 bg-night/95 backdrop-blur-md overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-[420px]" : "max-h-0"
          }`}
        >
          <nav className="px-4 py-3 flex flex-col">
            {navLinks.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="min-h-[44px] inline-flex items-center text-base text-cream/80 hover:text-gold transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/twilight.jpg"
          alt="Mariners Point golf course at twilight"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/50 to-night/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/60 via-transparent to-transparent" />
        {/* Warm amber glow */}
        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[#c9a84c]/10 to-transparent" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p className="text-gold tracking-[0.35em] text-xs uppercase mb-8">
            Foster City, CA &nbsp;·&nbsp; San Francisco Bay
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[0.95] mb-8">
            Golf Under
            <br />
            <span className="text-gold">The Lights</span>
          </h1>

          <p className="text-cream/75 text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            A par-3 course and world-class practice facility on the edge of San
            Francisco Bay — open until 10 PM, seven nights a week.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openBookingPanel}
              className="bg-gold text-night px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold-light transition-colors duration-200"
            >
              Book a Tee Time
            </button>
            <a
              href="#about"
              className="border border-cream/30 text-cream px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-colors duration-200"
            >
              Explore the Facility
            </a>
          </div>
        </div>

        {/* Scroll nudge */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-cream/30">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-cream/30 to-transparent" />
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────────────── */}
      <section id="about" className="py-28 md:py-36 bg-navy">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <p className="text-gold tracking-[0.25em] text-xs uppercase mb-5">
                Est. 1996 &nbsp;·&nbsp; Bob Cupp Design
              </p>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-7">
                Where the Bay
                <br />
                Meets the Game
              </h2>
              <p className="text-cream/65 leading-relaxed mb-5">
                Mariners Point Golf Center sits on 24 acres along the western
                edge of San Francisco Bay in Foster City. Designed by renowned
                architect Bob Cupp and opened in 1996, it was built to deliver
                serious golf in a setting that can&apos;t be replicated.
              </p>
              <p className="text-cream/65 leading-relaxed mb-10">
                What sets Mariners Point apart isn&apos;t just the view — it&apos;s the
                fact that you can play a proper round or a full practice session
                under stadium lights until 10 PM every single night. There&apos;s
                nowhere else in the Bay Area quite like it.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-6 border-t border-cream/10 pt-8">
                {[
                  { value: "24", sub: "Acres on the Bay" },
                  { value: "64", sub: "Hitting Stalls" },
                  { value: "10 PM", sub: "Last Tee Time" },
                ].map((s) => (
                  <div key={s.sub}>
                    <div className="text-3xl font-bold text-gold">{s.value}</div>
                    <div className="text-cream/45 text-xs mt-1.5">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Course.png"
                alt="Mariners Point course overview"
                className="w-full h-[520px] object-cover"
              />
              {/* Gold badge */}
              <div className="absolute bottom-4 left-4 sm:-bottom-5 sm:-left-5 bg-gold text-night py-5 px-6 text-center shadow-xl">
                <div className="text-3xl font-bold leading-none">7</div>
                <div className="text-[10px] font-bold uppercase tracking-widest mt-1">
                  Nights a Week
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Course ─────────────────────────────────────────────────── */}
      <section id="course" className="py-28 md:py-36 bg-night">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.25em] text-xs uppercase mb-4">
              Par 27 &nbsp;·&nbsp; 1,233 Yards
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">The Course</h2>
            <p className="text-cream/55 max-w-lg mx-auto text-sm leading-relaxed">
              Nine precision par-3 holes designed by Bob Cupp. Every hole
              demands shot-making. Beginner-friendly, satisfying for scratch
              players.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-cream/10 mb-16">
            {courseStats.map((s) => (
              <div
                key={s.label}
                className="bg-night p-8 hover:bg-navy transition-colors duration-300 group"
              >
                <div className="text-cream/35 text-[10px] tracking-[0.25em] uppercase mb-3">
                  {s.label}
                </div>
                <div className="text-2xl font-bold group-hover:text-gold transition-colors duration-200">
                  {s.value}
                </div>
                <div className="text-cream/45 text-xs mt-1.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Full-width image with text overlay */}
          <div className="relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Fairway.jpg"
              alt="Mariners Point fairway view"
              className="w-full h-[420px] md:h-[520px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <p className="text-gold text-xs tracking-[0.25em] uppercase mb-3">
                Signature Experience
              </p>
              <p className="text-2xl md:text-4xl font-bold max-w-xl leading-snug">
                Tee off as the sun drops behind the Bay. Then keep playing.
              </p>
            </div>
          </div>

          {/* Scorecard */}
          <div className="mt-14 md:mt-18 border border-cream/10 bg-navy/45 p-5 sm:p-7 md:p-9">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Course Scorecard</h3>
            <p className="text-cream/60 text-sm mb-5">
              9 holes · Par 27 · 1,233 yards from the white tees
            </p>

            <div className="relative">
              <div className="overflow-x-auto pb-2">
                <table className="min-w-[760px] w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-cream/15">
                      <th className="py-3 pr-4 text-xs uppercase tracking-[0.18em] text-cream/45 font-semibold">
                        Hole
                      </th>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((hole) => (
                        <th
                          key={hole}
                          className="py-3 px-2 text-base font-bold text-cream text-center"
                        >
                          {hole}
                        </th>
                      ))}
                      <th className="py-3 px-3 text-base font-bold text-center bg-gold/10 text-gold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-cream/[0.08]">
                      <th className="py-3 pr-4 text-sm font-medium text-cream/70">
                        Yardage (white tees)
                      </th>
                      {[142, 103, 123, 163, 166, 161, 162, 112, 101].map((val, i) => (
                        <td key={`white-${i}`} className="py-3 px-2 text-center text-cream/85">
                          {val}
                        </td>
                      ))}
                      <td className="py-3 px-3 text-center bg-gold/10 text-gold font-semibold">
                        1233
                      </td>
                    </tr>
                    <tr className="border-b border-cream/[0.08]">
                      <th className="py-3 pr-4 text-sm font-medium text-cream/70">
                        Yardage (red tees)
                      </th>
                      {[84, 70, 88, 94, 88, 124, 84, 76, 66].map((val, i) => (
                        <td key={`red-${i}`} className="py-3 px-2 text-center text-cream/85">
                          {val}
                        </td>
                      ))}
                      <td className="py-3 px-3 text-center bg-gold/10 text-gold font-semibold">
                        774
                      </td>
                    </tr>
                    <tr className="border-b border-cream/[0.08]">
                      <th className="py-3 pr-4 text-sm font-medium text-cream/70">Handicap</th>
                      {[4, 9, 7, 3, 5, 1, 2, 8, 6].map((val, i) => (
                        <td key={`hcp-${i}`} className="py-3 px-2 text-center text-cream/85">
                          {val}
                        </td>
                      ))}
                      <td className="py-3 px-3 text-center bg-gold/10 text-gold font-semibold">
                        —
                      </td>
                    </tr>
                    <tr>
                      <th className="py-3 pr-4 text-sm font-medium text-cream/70">Par</th>
                      {[3, 3, 3, 3, 3, 3, 3, 3, 3].map((val, i) => (
                        <td key={`par-${i}`} className="py-3 px-2 text-center text-cream/85">
                          {val}
                        </td>
                      ))}
                      <td className="py-3 px-3 text-center bg-gold/10 text-gold font-semibold">
                        27
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="pointer-events-none sm:hidden absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-navy/90 to-transparent flex items-center justify-end pr-1">
                <span className="text-gold/85 text-sm">→</span>
              </div>
            </div>

            <div className="mt-8 pt-7 border-t border-cream/10">
              <h4 className="text-xl font-bold mb-5">Local Rules &amp; Etiquette</h4>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gold mb-3">
                    Local Rules
                  </p>
                  <ul className="space-y-2.5 text-cream/70">
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      Out of bounds: all boundary fences
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      Water hazard: pond on hole 9 (drop in designated drop zone, one stroke penalty)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      If swing or stance is obstructed by the driving range protective screen or a light pole, take nearest point of relief plus one club length — no penalty
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gold mb-3">
                    Etiquette
                  </p>
                  <ul className="space-y-2.5 text-cream/70">
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      Caution: pedestrians beyond the boundary fence on the 5th green
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      Play only from the tee markers
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      Keep pace — about 10 minutes per hole
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      Replace divots and repair ball marks on the green
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      Rake bunkers after use; leave rakes in the bunker
                    </li>
                  </ul>
                </div>
              </div>

              <a
                href="https://www.marinerspoint.com/uploads/2/6/4/3/26433504/mariners_point_scorecard.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm text-cream/65 hover:text-gold transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 2v7" />
                  <path d="m4.5 6.8 2.5 2.5 2.5-2.5" />
                  <path d="M2.5 11.5h9" />
                </svg>
                Download printable scorecard (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Practice & Instruction ─────────────────────────────────────── */}
      <section id="practice" className="py-28 md:py-36 bg-navy">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.25em] text-xs uppercase mb-4">
              World-Class Facility
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">
              Practice &amp; Instruction
            </h2>
            <p className="text-cream/55 max-w-lg mx-auto text-sm leading-relaxed">
              Everything you need to improve your game — lit and open late every
              day of the week.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* Driving Range */}
            <div className="group">
              <div className="overflow-hidden mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/range.jpg"
                  alt="Mariners Point driving range"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-lg font-bold mb-3">Driving Range</h3>
              <p className="text-cream/55 text-sm leading-relaxed">
                64 hitting stalls across two levels, all equipped with Toptracer
                — the same ball-tracking system used on the PGA Tour. See your
                ball speed, carry distance, and shot shape instantly on screen.
              </p>
              <div className="mt-5 flex items-center gap-3 text-gold text-xs font-semibold tracking-widest uppercase">
                <span className="w-8 h-px bg-gold" />
                Toptracer Technology
              </div>
            </div>

            {/* Short Game */}
            <div className="group">
              <div className="overflow-hidden mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/shortgame.jpg"
                  alt="Short game practice area"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-lg font-bold mb-3">Short Game Area</h3>
              <p className="text-cream/55 text-sm leading-relaxed">
                A dedicated short-game zone with chipping, pitching, and bunker
                areas. The shots that cost you strokes — practiced until they
                don&apos;t.
              </p>
              <div className="mt-5 flex items-center gap-3 text-gold text-xs font-semibold tracking-widest uppercase">
                <span className="w-8 h-px bg-gold" />
                Chip · Pitch · Bunker
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lessons & Programs ─────────────────────────────────────────── */}
      <section id="lessons" className="py-28 md:py-36 bg-night">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.25em] text-xs uppercase mb-4">
              9 PGA-Certified Instructors
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">
              Lessons &amp; Programs
            </h2>
            <p className="text-cream/55 max-w-xl mx-auto text-sm leading-relaxed">
              One of the most complete teaching operations in the Bay Area —
              for beginners finding their footing and players working toward
              scratch.
            </p>
          </div>

          {/* Three cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-cream/10">

            {/* Private Lessons */}
            <div className="bg-night p-10 flex flex-col group hover:bg-navy transition-colors duration-300">
              {/* Icon */}
              <div className="mb-8">
                <svg
                  width="36" height="36" viewBox="0 0 36 36" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  className="text-gold"
                  aria-hidden="true"
                >
                  {/* Person */}
                  <circle cx="18" cy="10" r="5" />
                  <path d="M8 32c0-5.523 4.477-10 10-10s10 4.477 10 10" />
                  {/* Golf club suggestion — small diagonal line */}
                  <line x1="24" y1="20" x2="30" y2="30" />
                  <line x1="27" y1="29" x2="31" y2="29" />
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-4">Private Lessons</h3>
              <p className="text-cream/55 text-sm leading-relaxed mb-4 flex-1">
                One-on-one and semi-private instruction with nine PGA-certified
                professionals. All skill levels welcome — total beginners to
                accomplished players. The facility includes a 2-acre short-game
                area, both grass and mat hitting stalls, and digital swing
                analysis.
              </p>
              <p className="text-cream/45 text-xs leading-relaxed mb-8">
                Each instructor brings a different philosophy and style. Players
                are encouraged to find the right match for how they learn.
              </p>
              <Link
                href="/instructors"
                className="mt-auto inline-flex items-center gap-3 text-gold text-xs font-bold tracking-[0.2em] uppercase group/link min-h-[44px]"
              >
                <span className="w-8 h-px bg-gold group-hover/link:w-12 transition-all duration-300" />
                Meet Our Instructors
              </Link>
            </div>

            {/* Group Lessons */}
            <div className="bg-night p-10 flex flex-col group hover:bg-navy transition-colors duration-300">
              {/* Icon */}
              <div className="mb-8">
                <svg
                  width="36" height="36" viewBox="0 0 36 36" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  className="text-gold"
                  aria-hidden="true"
                >
                  {/* Two people */}
                  <circle cx="13" cy="10" r="4.5" />
                  <path d="M4 32c0-4.97 4.03-9 9-9s9 4.03 9 9" />
                  <circle cx="25" cy="9" r="3.5" />
                  <path d="M22 32c0-3.866 1.79-7.316 4.6-9.6" />
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-4">Group Lessons</h3>
              <p className="text-cream/55 text-sm leading-relaxed mb-4 flex-1">
                Clinics for golfers who want to learn alongside others. Mariners
                Point runs its own group lesson programs and hosts clinics from
                the Silicon Valley Golf Performance Center — covering total
                beginners through course-ready players.
              </p>
              <p className="text-cream/45 text-xs leading-relaxed mb-8">
                A great entry point for new golfers, and a cost-effective way
                for experienced players to work on specific parts of their game
                with others.
              </p>
              <Link
                href="/group-lessons"
                className="mt-auto inline-flex items-center gap-3 text-gold text-xs font-bold tracking-[0.2em] uppercase group/link min-h-[44px]"
              >
                <span className="w-8 h-px bg-gold group-hover/link:w-12 transition-all duration-300" />
                View Group Programs
              </Link>
            </div>

            {/* Junior Camps & Leagues */}
            <div className="bg-night p-10 flex flex-col group hover:bg-navy transition-colors duration-300">
              {/* Icon */}
              <div className="mb-8">
                <svg
                  width="36" height="36" viewBox="0 0 36 36" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  className="text-gold"
                  aria-hidden="true"
                >
                  {/* Star */}
                  <path d="M18 4l3.6 7.4 8.1 1.2-5.9 5.7 1.4 8.1L18 22.5l-7.2 3.9 1.4-8.1-5.9-5.7 8.1-1.2z" />
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-4">Junior Camps &amp; Leagues</h3>
              <p className="text-cream/55 text-sm leading-relaxed mb-4 flex-1">
                A full junior development program: summer camps at Mariners
                Point, additional camps run by Silicon Valley Golf Performance
                Center, plus PGA Jr. League and PGA Little Linksters Jr. League
                for kids ready for competitive play.
              </p>
              <p className="text-cream/45 text-xs leading-relaxed mb-8">
                Private lessons for juniors are also available. The goal is
                developing players who love the game — not just good scores.
              </p>
              <Link
                href="/junior-programs"
                className="mt-auto inline-flex items-center gap-3 text-gold text-xs font-bold tracking-[0.2em] uppercase group/link min-h-[44px]"
              >
                <span className="w-8 h-px bg-gold group-hover/link:w-12 transition-all duration-300" />
                Explore Junior Programs
              </Link>
            </div>

          </div>

          {/* Bottom note */}
          <p className="text-center text-cream/30 text-xs mt-10">
            Call{" "}
            <a href="tel:6505737888" className="hover:text-gold transition-colors">
              (650) 573-7888
            </a>{" "}
            to book a lesson or ask about current program schedules.
          </p>
        </div>
      </section>

      {/* ── Value Cards ────────────────────────────────────────────────── */}
      <section id="value-cards" className="py-28 md:py-36 bg-navy">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-gold tracking-[0.25em] text-xs uppercase mb-4">
              Pro Shop
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Value Cards</h2>
            <p className="text-cream/50 text-sm max-w-sm mx-auto">
              Prepaid cards that pay for themselves.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Frequent Play Card */}
            <div className="border border-cream/10 p-10 flex flex-col">
              <p className="text-[10px] uppercase tracking-[0.3em] text-cream/35 mb-8">
                Frequent Play Card
              </p>
              <div className="mb-1">
                <span className="text-5xl font-bold text-gold">$160</span>
              </div>
              <p className="text-cream/40 text-xs tracking-wide mb-6">
                10 rounds of golf
              </p>
              <p className="text-cream/60 text-sm leading-relaxed flex-1">
                Ten rounds on the 9-hole par-3, prepaid and ready whenever you are.
              </p>
              <div className="mt-10 pt-6 border-t border-cream/[0.07]">
                <p className="text-cream/30 text-[11px] uppercase tracking-[0.2em]">
                  Buy at the Pro Shop
                </p>
              </div>
            </div>

            {/* Range Ball Card */}
            <div className="border border-cream/10 p-10 flex flex-col">
              <p className="text-[10px] uppercase tracking-[0.3em] text-cream/35 mb-8">
                Range Ball Card
              </p>
              <div className="mb-1">
                <span className="text-5xl font-bold text-gold">$100</span>
              </div>
              <p className="text-cream/40 text-xs tracking-wide mb-6">
                $115 in practice balls
              </p>
              <p className="text-cream/60 text-sm leading-relaxed flex-1">
                $15 in bonus range balls — for golfers who come to grind.
              </p>
              <div className="mt-10 pt-6 border-t border-cream/[0.07]">
                <p className="text-cream/30 text-[11px] uppercase tracking-[0.2em]">
                  Buy at the Pro Shop
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 border border-cream/10 bg-night/45 px-6 py-5 md:px-8 md:py-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <span className="inline-flex items-center border border-cream/20 text-cream/45 text-[10px] uppercase tracking-[0.2em] px-2.5 py-1">
                In development
              </span>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-cream/55">
                <span className="px-2.5 py-1 border border-cream/20">Apple Wallet</span>
                <span className="px-2.5 py-1 border border-cream/20">Google Wallet</span>
              </div>
            </div>
            <h3 className="text-base md:text-lg text-cream/90 mb-2">
              Coming soon: cards that live in your wallet.
            </h3>
            <p className="text-sm text-cream/60 leading-relaxed max-w-4xl">
              Buy once, redeem anywhere. Apple Wallet and Google Wallet
              integration is on the way — your card balance updated after every
              round, no plastic to lose.
            </p>
          </div>
        </div>
      </section>

      {/* ── Community & Leagues ────────────────────────────────────────── */}
      <section id="community" className="py-28 md:py-36 bg-night">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.25em] text-xs uppercase mb-4">
              Community
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Leagues &amp; Groups
            </h2>
            <p className="text-cream/50 text-sm max-w-md mx-auto leading-relaxed">
              Mariners Point is a place to belong, not just play.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Meadowlarks */}
            <div className="border-l-2 border-gold/40 pl-7 py-2 flex flex-col gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold/70 mb-2">
                  Women&apos;s Group
                </p>
                <h3 className="text-lg font-bold mb-1">Meadowlarks</h3>
                <p className="text-cream/45 text-xs italic">
                  All ages, all levels, mostly fun.
                </p>
              </div>
              <p className="text-cream/60 text-sm leading-relaxed">
                A welcoming women&apos;s group that plays Monday mornings (and
                Wednesday mornings casually). Nine holes, shotgun start at
                8:00 AM, wrapped up before 10:00. Friendly competition,
                strong emphasis on the &ldquo;fun.&rdquo;
              </p>
              <div className="mt-auto pt-5 border-t border-cream/[0.07]">
                <p className="text-[11px] uppercase tracking-[0.15em] text-cream/30 mb-1">
                  How to join
                </p>
                <p className="text-cream/55 text-xs leading-relaxed">
                  Leave your name and contact info in the Meadowlarks box at
                  the Pro Shop.
                </p>
              </div>
            </div>

            {/* Spark Golf */}
            <div className="border-l-2 border-gold/40 pl-7 py-2 flex flex-col gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold/70 mb-2">
                  Evening League
                </p>
                <h3 className="text-lg font-bold mb-1">Spark Golf Monday League</h3>
                <p className="text-cream/45 text-xs italic">
                  Monday nights, under the lights.
                </p>
              </div>
              <p className="text-cream/60 text-sm leading-relaxed">
                A casual, social 9-hole league at Mariners Point. Tee times
                start at 5:00 PM. Free to join — you only pay for the rounds
                you actually play. Each round includes both a 2-person team
                game and an individual game, with end-of-season champions.
                Handicaps provided automatically; no existing handicap
                required.
              </p>
              <div className="mt-auto pt-5 border-t border-cream/[0.07]">
                <p className="text-[11px] uppercase tracking-[0.15em] text-cream/30 mb-1">
                  How to join
                </p>
                <p className="text-cream/55 text-xs leading-relaxed mb-2">
                  Free to join. Sign up on the Spark Golf app or website.
                </p>
                <a
                  href="https://www.spark.golf/golf-leagues/bay-area/2026-03-09-mariners-point-monday-league-at-mariners-point-golf-links-practice-center-11942"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center min-h-[44px] text-gold text-xs tracking-wide hover:underline"
                >
                  Join the league
                </a>
              </div>
            </div>

            {/* Placeholder */}
            <div className="border border-dashed border-cream/[0.12] p-7 flex flex-col gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-cream/25 mb-2">
                  Your Group
                </p>
                <h3 className="text-lg font-bold mb-1 text-cream/50">
                  Your League Here
                </h3>
                <p className="text-cream/30 text-xs italic">
                  Want to start something?
                </p>
              </div>
              <p className="text-cream/40 text-sm leading-relaxed">
                Corporate groups, friend groups, charity outings — we can
                host it.
              </p>
              <div className="mt-auto pt-5 border-t border-cream/[0.07]">
                <a
                  href="tel:6505737888"
                  className="inline-flex items-center gap-3 min-h-[44px] text-gold/70 text-xs font-bold tracking-[0.2em] uppercase hover:text-gold transition-colors duration-200"
                >
                  <span className="w-5 h-px bg-current" />
                  Get in touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Birdie's Teaser ─────────────────────────────────────────────── */}
      <section
        id="birdies"
        className="py-28 md:py-36 bg-[linear-gradient(145deg,#13263a_0%,#1b3046_52%,#223a52_100%)]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start mb-12">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/birdies-logo.png"
                alt="Birdie's at Mariners Point logo"
                className="h-16 md:h-20 w-auto mb-6"
              />
              <p className="text-birdies-brass tracking-[0.25em] text-xs uppercase mb-4">
                Est. 2022
              </p>
              <h2 className="text-birdies-cream text-4xl md:text-5xl leading-tight mb-6 font-birdies">
                Birdie&apos;s at Mariners Point
              </h2>
              <p className="text-birdies-cream/80 max-w-xl leading-relaxed">
                Birdie&apos;s is the bar and grill at Mariners Point. Smashburgers,
                street tacos, wood-fired pizza, a full bar, and a cold beer
                waiting after 18, or nine. Est. 2022.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="https://my-site-100783-102620.square.site/s/order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-birdies-brass text-birdies-navy px-5 py-3 text-xs font-bold tracking-[0.18em] uppercase hover:bg-[#c69b58] transition-colors duration-200"
                >
                  Order Ahead
                  <span aria-hidden="true">↗</span>
                </a>
                <Link
                  href="/birdies"
                  className="inline-flex items-center gap-3 text-birdies-brass text-xs font-bold tracking-[0.2em] uppercase hover:text-[#d4ad6a] transition-colors duration-200"
                >
                  <span className="w-8 h-px bg-current" />
                  See the full menu →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden border border-birdies-cream/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Bar.jpg"
                  alt="Cold beer and full bar at Birdie's"
                  className="h-44 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-birdies-navy/90 via-birdies-navy/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-birdies-cream text-xs tracking-[0.2em] uppercase">
                    Full Bar
                  </p>
                </div>
              </div>
              <div className="relative overflow-hidden border border-birdies-cream/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Food Truck.jpg"
                  alt="Fresh food at Birdie's"
                  className="h-44 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-birdies-navy/90 via-birdies-navy/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-birdies-cream text-xs tracking-[0.2em] uppercase">
                    Grill Favorites
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Birdie's Smashburger", detail: "Angus beef · house sauce" },
              { name: "Suavecito Street Tacos", detail: "Chicken · asada · fish" },
              { name: "Quesabirria", detail: "Braised beef · consommé" },
              { name: "Wood-Fired Pizza", detail: "Slice or whole pie" },
              { name: "Chicken Wings", detail: "Buffalo · BBQ · ranch" },
              { name: "Drafts & Cans", detail: "Cold beer after your round" },
            ].map((item) => (
              <div
                key={item.name}
                className="border border-birdies-cream/20 bg-birdies-cream/[0.04] p-6"
              >
                <h3 className="font-birdies text-birdies-cream text-2xl leading-tight mb-2">
                  {item.name}
                </h3>
                <p className="text-birdies-cream/70 text-sm">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rates ──────────────────────────────────────────────────────── */}
      <section id="rates" className="py-28 md:py-36 bg-night">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.25em] text-xs uppercase mb-4">
              Pricing
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">Rates</h2>
            <p className="text-cream/55 max-w-md mx-auto text-sm leading-relaxed">
              Estimated rates for design purposes. Call{" "}
              <a href="tel:6505737888" className="text-gold hover:underline">
                (650) 573-7888
              </a>{" "}
              for current pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Green fees */}
            <div className="border border-cream/10 p-8">
              <h3 className="text-base font-bold tracking-wide mb-6 pb-5 border-b border-cream/10">
                Green Fees — 9 Holes
              </h3>
              <div className="space-y-1">
                {greenFees.map((r) => (
                  <div
                    key={r.name}
                    className="flex justify-between items-center py-3 border-b border-cream/[0.06]"
                  >
                    <span className="text-cream/60 text-sm">{r.name}</span>
                    <span className="text-gold font-bold">{r.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Range buckets */}
            <div className="border border-cream/10 p-8">
              <h3 className="text-base font-bold tracking-wide mb-6 pb-5 border-b border-cream/10">
                Driving Range Buckets
              </h3>
              <div className="space-y-1">
                {rangeBuckets.map((r) => (
                  <div
                    key={r.name}
                    className="flex justify-between items-center py-3 border-b border-cream/[0.06]"
                  >
                    <span className="text-cream/60 text-sm">{r.name}</span>
                    <span className="text-gold font-bold">{r.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hours & Contact ────────────────────────────────────────────── */}
      <section id="contact" className="py-28 md:py-36 bg-navy">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Info */}
            <div>
              <p className="text-gold tracking-[0.25em] text-xs uppercase mb-5">
                Visit Us
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-10">
                Hours &amp; Contact
              </h2>

              <div className="mb-10">
                {hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between items-center py-4 border-b border-cream/10"
                  >
                    <span className="text-cream/55 text-sm">{h.day}</span>
                    <span className="font-semibold text-sm">{h.time}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-sm text-cream/65">
                <div className="flex items-start gap-4">
                  <span className="text-gold mt-0.5 flex-shrink-0">→</span>
                  <span>2401 E 3rd Ave, Foster City, CA 94404</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gold flex-shrink-0">→</span>
                  <a
                    href="tel:6505737888"
                    className="hover:text-gold transition-colors duration-200"
                  >
                    (650) 573-7888
                  </a>
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="flex items-center justify-center h-[460px] border border-cream/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/marinerspoint.png"
                alt="Mariners Point Golf Center"
                className="w-full max-w-sm object-contain p-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-night border-t border-cream/10 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-5 text-xs text-cream/35">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-gold font-semibold tracking-wide">
              Mariners Point Golf Center
            </span>
            <span>·</span>
            <span>2401 E 3rd Ave, Foster City, CA 94404</span>
          </div>

          <p className="text-center">
            Redesign concept by{" "}
            <span className="text-cream/60 font-semibold">Andrew Shaw</span> —
            not affiliated with Mariners Point Golf Center.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/cancel"
              className="hover:text-gold transition-colors duration-200"
            >
              Cancel a booking
            </Link>
            <a
              href="tel:6505737888"
              className="hover:text-gold transition-colors duration-200"
            >
              (650) 573-7888
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
