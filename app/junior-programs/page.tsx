import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Junior Programs — Mariners Point Golf Center",
  description:
    "Explore Mariners Point Junior Programs including Summer Camps, PGA Jr. League, and PGA Little Linksters led by Ron Sagara, PGA.",
};

type CampWeek = {
  dates: string;
  hours: string;
  ages: string;
  price: string;
  availability?: {
    label: string;
    tone: "spots" | "waitlist";
  };
};

const campWeeks: CampWeek[] = [
  {
    dates: "June 8-12",
    hours: "Full-day: 9:00 AM-3:30 PM · Half-day: 9:00 AM-12:00 PM",
    ages: "10-15",
    price: "Full-day $850 (or $895 with exceptional lunch included) · Half-day $600",
  },
  {
    dates: "June 15-19",
    hours: "Full-day: 9:00 AM-3:30 PM · Half-day: 9:00 AM-12:00 PM",
    ages: "10-15",
    price: "Full-day $850 (or $895 with exceptional lunch included) · Half-day $600",
  },
  {
    dates: "June 22-26",
    hours: "Full-day: 9:00 AM-3:30 PM · Half-day: 9:00 AM-12:00 PM",
    ages: "10-15",
    price: "Full-day $850 (or $895 with exceptional lunch included) · Half-day $600",
  },
  {
    dates: "June 29-July 1",
    hours: "3-day camp only",
    ages: "10-15",
    price: "$510 full-day · $540 with lunch · $360 half-day",
  },
  {
    dates: "July 6-10",
    hours: "Full-day: 9:00 AM-3:30 PM · Half-day: 9:00 AM-12:00 PM",
    ages: "10-15",
    price: "Full-day $850 (or $895 with exceptional lunch included) · Half-day $600",
  },
  {
    dates: "July 13-17",
    hours: "Full-day: 9:00 AM-3:30 PM · Half-day: 9:00 AM-12:00 PM",
    ages: "10-15",
    price: "Full-day $850 (or $895 with exceptional lunch included) · Half-day $600",
    availability: {
      label: "2 spots left",
      tone: "spots",
    },
  },
  {
    dates: "July 20-24",
    hours: "Full-day: 9:00 AM-3:30 PM · Half-day: 9:00 AM-12:00 PM",
    ages: "10-15",
    price: "Full-day $850 (or $895 with exceptional lunch included) · Half-day $600",
  },
  {
    dates: "July 27-31",
    hours: "Full-day: 9:00 AM-3:30 PM · Half-day: 9:00 AM-12:00 PM",
    ages: "10-15",
    price: "Full-day $850 (or $895 with exceptional lunch included) · Half-day $600",
  },
  {
    dates: "August 3-7",
    hours: "Full-day: 9:00 AM-3:30 PM · Half-day: 9:00 AM-12:00 PM",
    ages: "10-15",
    price: "Full-day $850 (or $895 with exceptional lunch included) · Half-day $600",
  },
  {
    dates: "August 10-14",
    hours: "Half-day only: 9:00 AM-12:00 PM",
    ages: "10-15",
    price: "Half-day $600",
    availability: {
      label: "Waitlist",
      tone: "waitlist",
    },
  },
];

function CampWeekCard({ week }: { week: CampWeek }) {
  return (
    <article className="border border-cream/15 bg-[#132132] p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-2xl text-cream font-semibold leading-tight">{week.dates}</h3>
        {week.availability && (
          <span
            className={`text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 border ${
              week.availability.tone === "waitlist"
                ? "text-[#f0c98d] border-[#f0c98d]/45 bg-[#f0c98d]/10"
                : "text-[#e8c97a] border-[#e8c97a]/45 bg-[#e8c97a]/10"
            }`}
          >
            {week.availability.label}
          </span>
        )}
      </div>

      <dl className="mt-5 space-y-3 flex-1">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-1">Hours</dt>
          <dd className="text-sm text-cream/80 leading-relaxed">{week.hours}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-1">Ages</dt>
          <dd className="text-sm text-cream/80">{week.ages}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-1">Price</dt>
          <dd className="text-base font-semibold text-gold leading-snug">{week.price}</dd>
        </div>
      </dl>

      <a
        href="#"
        className="mt-6 inline-flex items-center gap-2 min-h-[44px] text-xs tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors duration-200"
      >
        <span className="w-6 h-px bg-current" />
        Register
      </a>
    </article>
  );
}

export default function JuniorProgramsPage() {
  return (
    <main className="bg-night text-cream min-h-screen">
      <div className="pt-20 border-b border-cream/10 bg-night">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-cream/50 hover:text-cream transition-colors duration-200"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="7" x2="2" y2="7" />
              <polyline points="6 3 2 7 6 11" />
            </svg>
            Back to Mariners Point
          </Link>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-cream/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Course.png"
          alt="Mariners Point course"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#101a26]/88 via-[#101a26]/88 to-[#101a26]/96" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <p className="text-gold tracking-[0.25em] text-xs uppercase mb-5">Junior Golf at Mariners Point</p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl max-w-4xl leading-tight font-bold mb-6">
            Where the next Will Zalatoris is learning the game.
          </h1>
          <p className="text-cream/80 text-base md:text-lg max-w-3xl leading-relaxed">
            Will Zalatoris, now a PGA Tour pro, attended Mariners Point summer camp as a kid and made a hole-in-one here.
            He came back years later to recreate it.
          </p>
          <p className="mt-7 text-cream/55 text-xs uppercase tracking-[0.2em]">
            Celebrating our 30th season of junior golf.
          </p>
        </div>
      </section>

      <section className="bg-navy border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-14">
          <div className="border border-cream/15 bg-night/40 p-6 md:p-7">
            <p className="text-gold tracking-[0.2em] text-xs uppercase mb-3">Director of Junior Golf</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ron Sagara, PGA</h2>
            <p className="text-cream/70 leading-relaxed max-w-4xl">
              Ron leads every junior pathway at Mariners Point, from first-time camp players to league-ready competitors.
              His focus is straightforward: build strong fundamentals, create confidence, and keep kids excited to keep showing up.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/instructors/ron-sagara"
                className="inline-flex items-center gap-2 min-h-[44px] text-sm text-gold hover:text-gold-light transition-colors"
              >
                <span className="w-6 h-px bg-current" />
                View instructor profile →
              </Link>
              <a
                href="tel:6506788803"
                className="text-sm text-cream/75 hover:text-cream transition-colors"
              >
                (650) 678-8803
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <p className="text-gold tracking-[0.22em] text-xs uppercase mb-4">Section 1</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-5">Summer Camps</h2>
          <p className="text-cream/70 leading-relaxed max-w-4xl mb-10">
            Summer Camps are designed for all skill levels. Beginners learn everything from grip to course play,
            and experienced juniors sharpen their game with on-course experience and TOPTRACER simulator sessions on the range.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {campWeeks.map((week) => (
              <CampWeekCard key={week.dates} week={week} />
            ))}
          </div>

          <p className="mt-8 text-sm text-cream/55 leading-relaxed max-w-3xl">
            Registration uses a password-protected form to prevent overbooking. Best completed on a laptop or desktop.
            Contact Ron for the access code.
          </p>
        </div>
      </section>

      <section className="bg-navy border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <p className="text-gold tracking-[0.22em] text-xs uppercase mb-4">Section 2</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3">PGA Jr. League (Spring/Summer 2026)</h2>
          <p className="text-cream/80 text-lg font-medium mb-4">Numbered jerseys. Real teams. Real coaching.</p>
          <p className="text-cream/70 leading-relaxed max-w-4xl mb-10">
            PGA Jr. League is team-format competitive golf for juniors. Kids wear team uniforms, play matches against other clubs,
            and learn under expert PGA coaching. Steph Curry is the league&apos;s national ambassador. It&apos;s structured, it&apos;s social,
            and kids love it.
          </p>

          <div className="border border-cream/15 bg-night/35 p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6 md:gap-x-10">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Season</p>
                  <p className="text-lg text-cream font-semibold">May 30 - June 28, 2026 (5 consecutive weeks)</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Format</p>
                  <p className="text-cream/80">Saturday AM practices + Sunday AM games</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Ages</p>
                  <p className="text-cream/80">Up to 15 (15U division)</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Cost</p>
                  <p className="text-lg text-gold font-semibold">
                    $719 per player ($599 coaching fee + $120 annual PGA membership, billed once per calendar year)
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Registration Window</p>
                  <p className="text-cream/80">March 30 - May 1, 2026</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Captain</p>
                  <p className="text-cream/80">Ron Sagara, PGA - Junior Golf Director</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-3">What&apos;s Included</p>
                <ul className="space-y-2.5 text-cream/80">
                  <li className="flex items-start gap-2"><span className="text-gold">•</span>5 Saturday practice sessions</li>
                  <li className="flex items-start gap-2"><span className="text-gold">•</span>5 Sunday games</li>
                  <li className="flex items-start gap-2"><span className="text-gold">•</span>Team uniform kit</li>
                  <li className="flex items-start gap-2"><span className="text-gold">•</span>Range balls and green fees</li>
                  <li className="flex items-start gap-2"><span className="text-gold">•</span>Use of TOPTRACER on the driving range</li>
                </ul>
                <p className="mt-5 text-sm text-cream/60">Equipment not provided. Space is limited.</p>
                <a
                  href="#"
                  className="mt-6 inline-flex items-center gap-2 min-h-[44px] text-xs tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors duration-200"
                >
                  <span className="w-6 h-px bg-current" />
                  Register on PGA Jr. League
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <p className="text-gold tracking-[0.22em] text-xs uppercase mb-4">Section 3</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3">PGA Little Linksters Jr. League</h2>
          <p className="text-cream/80 text-lg font-medium mb-6">Real team golf, ages 8 and 9.</p>

          <div className="border border-[#f0c98d]/35 bg-[#f0c98d]/8 text-[#f0c98d] inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-8">
            Currently sold out - new league coming soon.
          </div>

          <p className="text-cream/70 leading-relaxed max-w-4xl mb-10">
            Little Linksters is the entry point for the youngest junior golfers. It is a small, intimate league for 4 boys
            and 4 girls who&apos;ve already had some instruction (our summer camps count, as do similar programs at other clubs).
            8:1 student-to-instructor ratio means every kid gets real attention.
          </p>

          <div className="border border-cream/15 bg-[#111d2c] p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6 md:gap-x-10">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Ages</p>
                  <p className="text-lg text-cream font-semibold">8 and 9</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Format</p>
                  <p className="text-cream/80">6 Saturday practice sessions, 12:00-1:00 PM (no on-course matches)</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Cost</p>
                  <p className="text-lg text-gold font-semibold">$470 (includes $120 annual PGA registration fee)</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Ratio</p>
                  <p className="text-cream/80">8 students : 1 instructor</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Prerequisite</p>
                  <p className="text-cream/80">Some prior golf instruction</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Equipment</p>
                  <p className="text-cream/80">Players must have their own clubs</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-3">What&apos;s Included</p>
                <ul className="space-y-2.5 text-cream/80">
                  <li className="flex items-start gap-2"><span className="text-gold">•</span>Cap or visor</li>
                  <li className="flex items-start gap-2"><span className="text-gold">•</span>Two personalized team jerseys</li>
                  <li className="flex items-start gap-2"><span className="text-gold">•</span>Special edition hoodie (while supplies last)</li>
                  <li className="flex items-start gap-2"><span className="text-gold">•</span>Bag tag</li>
                  <li className="flex items-start gap-2"><span className="text-gold">•</span>Drawstring carry bag</li>
                  <li className="flex items-start gap-2"><span className="text-gold">•</span>Six hours of PGA Professional instruction</li>
                </ul>

                <a
                  href="#"
                  className="mt-6 inline-flex items-center gap-2 min-h-[44px] text-xs tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors duration-200"
                >
                  <span className="w-6 h-px bg-current" />
                  Join the waitlist
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-navy px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="border border-cream/15 bg-night/40 p-6">
            <p className="text-cream/80 text-sm leading-relaxed">
              Questions about junior programs? Contact Ron Sagara, PGA - Junior Golf Director -
              <a href="tel:6506788803" className="text-gold hover:text-gold-light transition-colors ml-1">
                (650) 678-8803
              </a>
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 text-sm text-cream/65 hover:text-cream transition-colors"
            >
              <span className="w-5 h-px bg-current" />
              Back to Mariners Point
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
