import type { Metadata } from "next";
import Link from "next/link";
import { PartnerInstructorAvatar } from "../components/PartnerInstructorAvatar";

export const metadata: Metadata = {
  title: "Adult Group Golf Lessons — Mariners Point Golf Center",
  description:
    "Beginning Series I & II and Monthly Skills Clinics with Silicon Valley Golf Performance Center at Mariners Point in Foster City, CA.",
};

type Package = {
  name: string;
  tagline: string;
  price: string;
  description: string;
  includes: string[];
  prerequisite: string;
  highlight?: boolean;
  cta: string;
};

const packages: Package[] = [
  {
    name: "Beginning Series I",
    tagline: "Fundamentals on the range.",
    price: "$300",
    description:
      "Six one-hour group sessions with 4-8 students per class. Built for golfers who have never played, or have played very little. Learn the swing basics, short game, and etiquette in a welcoming, structured environment.",
    includes: [
      "6 one-hour group instruction sessions",
      "All necessary equipment provided (clubs and balls)",
      "Guided drills and practice recommendations",
      "Classes repeat - if you miss one, you can make it up",
    ],
    prerequisite: "None. Start with class #1 or #2.",
    cta: "Sign up for Series I",
  },
  {
    name: "Beginning Series II",
    tagline: "From the range to the course.",
    price: "$400",
    description:
      "Designed to help you transition from practice to play. 7.5 hours of group instruction over six weeks, alternating between range work and real on-course play. By the end, you will have the skills and confidence to play 9 holes.",
    includes: [
      "7.5 hours of group instruction over 6 weeks",
      "Three 60-minute range sessions",
      "Three 90-minute on-course sessions",
    ],
    prerequisite:
      "Completion of Beginning Series I or at least 6 hours of prior golf instruction. Players must bring their own clubs.",
    highlight: true,
    cta: "Sign up for Series II",
  },
  {
    name: "Monthly Skills Clinic",
    tagline: "Sharpen one part of your game at a time.",
    price: "$150",
    description:
      "A 90-minute clinic each month, focused on one key area: long drives, short game, putting, course management. Expert instruction, personalized feedback, and focused drills. Ideal for graduates of Beginning Series II who want to keep improving.",
    includes: [
      "90-minute clinic, hosted monthly",
      "One area of focus per session",
      "Personalized feedback",
    ],
    prerequisite:
      "Best for those who have completed Beginning Series II or have equivalent experience. Players must bring their own clubs.",
    cta: "Sign up for Clinic",
  },
];

const journey = [
  {
    step: "Beginning Series I",
    summary: "Learn the basics",
    price: "$300",
  },
  {
    step: "Beginning Series II",
    summary: "Take it to the course",
    price: "$400",
  },
  {
    step: "Monthly Skills Clinic",
    summary: "Keep getting better",
    price: "$150/month",
  },
];

const instructors = [
  { name: "Kim Stevens", photo: "/kim-stevens.jpg" },
  { name: "Scott Stevens", photo: "/scott-stevens.jpg" },
  { name: "Bernadette Perenne", photo: "/bernadette-perenne.jpg" },
  { name: "Lorena Cuffy", photo: "/lorena-cuffy.jpg" },
  { name: "Sean Barry", photo: "/sean-barry.jpg" },
];

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function GroupLessonsPage() {
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
          src="/range.jpg"
          alt="Mariners Point driving range"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/82 via-night/84 to-night/92" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-30">
          <p className="text-gold tracking-[0.24em] text-xs uppercase mb-5">Adult Group Lessons</p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight max-w-4xl mb-6">
            Learn the game with people on the same page.
          </h1>
          <p className="text-cream/80 text-base md:text-lg max-w-3xl leading-relaxed">
            Adult group lessons at Mariners Point, taught by Silicon Valley Golf Performance Center,
            the premier golf learning center in the Bay Area.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-cream/55">
            Three packages. Real progression. From your first swing to your weekly tune-up.
          </p>
          <div className="mt-8 text-sm text-cream/65">
            In partnership with{" "}
            <a
              href="https://svgolfpc.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors"
            >
              Silicon Valley Golf Performance Center
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-gold tracking-[0.22em] text-xs uppercase mb-3">Choose Your Package</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Three ways to learn at Mariners Point</h2>
            <p className="text-cream/65 leading-relaxed">
              Start at the level that fits your current game. Every package is clear on price, prerequisites,
              and what you get.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {packages.map((pkg) => (
              <article
                key={pkg.name}
                className={`h-full p-7 flex flex-col border ${
                  pkg.highlight
                    ? "border-gold bg-gold/[0.06] shadow-[0_14px_35px_rgba(0,0,0,0.35)]"
                    : "border-cream/15 bg-navy"
                }`}
              >
                {pkg.highlight && (
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-4">Most popular</p>
                )}
                <h3 className="text-3xl font-bold leading-tight">{pkg.name}</h3>
                <p className="text-cream/65 mt-2 text-sm">{pkg.tagline}</p>
                <div className="mt-6 mb-5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cream/40">Price</p>
                  <p className="text-5xl font-bold text-gold mt-1 leading-none">{pkg.price}</p>
                </div>
                <p className="text-cream/75 text-sm leading-relaxed">{pkg.description}</p>

                <div className="mt-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/45 mb-3">Includes</p>
                  <ul className="space-y-2 text-cream/80 text-sm leading-relaxed">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-gold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-5 border-t border-cream/12">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/45 mb-2">Prerequisite</p>
                  <p className="text-sm text-cream/75 leading-relaxed">{pkg.prerequisite}</p>
                </div>

                <a
                  href="https://www.svgolfpc.com/lessons/adult-lessons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 min-h-[44px] text-xs tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors"
                >
                  <span className="w-6 h-px bg-current" />
                  {pkg.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-18">
          <p className="text-gold tracking-[0.22em] text-xs uppercase mb-4">How the Journey Works</p>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {journey.map((item, index) => (
              <div key={item.step} className="border border-cream/15 bg-night/45 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-2">Step {index + 1}</p>
                <h3 className="text-2xl font-semibold leading-tight">{item.step}</h3>
                <p className="text-cream/70 mt-2">{item.summary}</p>
                <p className="text-gold font-semibold mt-3">{item.price}</p>
              </div>
            ))}
          </div>
          <p className="mt-7 text-cream/70 leading-relaxed max-w-4xl">
            Most golfers start with Beginning Series I, transition to Series II once they have the fundamentals,
            and then drop into the Monthly Skills Clinic to keep improving. But every package can be taken on its
            own, start wherever fits.
          </p>
        </div>
      </section>

      <section className="border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-18">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Taught by the SVGPC team.</h2>
          <p className="text-cream/70 max-w-3xl leading-relaxed mb-9">
            Group lessons at Mariners Point are taught by Silicon Valley Golf Performance Center&apos;s team of certified
            coaches. Each instructor brings a different style and specialty.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            {instructors.map((instructor) => (
              <article key={instructor.name} className="border border-cream/15 bg-navy p-5 text-center">
                <div className="mb-4">
                  <PartnerInstructorAvatar
                    name={instructor.name}
                    initials={initialsFromName(instructor.name)}
                    photo={instructor.photo}
                  />
                </div>
                <h3 className="text-base font-semibold leading-snug">{instructor.name}</h3>
              </article>
            ))}
          </div>

          <p className="mt-6 text-sm text-cream/60">
            Full instructor profiles available at{" "}
            <a
              href="https://svgolfpc.com/team"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors"
            >
              svgolfpc.com
            </a>
          </p>
        </div>
      </section>

      <section className="bg-navy border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-18">
          <div className="border border-cream/15 bg-night/45 p-7 md:p-9">
            <p className="text-gold tracking-[0.2em] text-xs uppercase mb-3">Schedule</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              View the full schedule of upcoming Mariners Point group lessons
            </h2>
            <a
              href="https://svgolfpc.com/events-calendar/mariners-point-golf-center/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] text-xs tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors"
            >
              <span className="w-6 h-px bg-current" />
              Open schedule
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream/45 mb-4">Purchase Policy</p>
          <ul className="space-y-2 text-sm text-cream/70 leading-relaxed">
            <li>Lessons never expire.</li>
            <li>Refunds are available within 12 months of purchase.</li>
            <li>Lesson types can be converted to other formats on request.</li>
            <li>Non-refundable transaction fees are deducted from any refund.</li>
          </ul>
          <a
            href="https://svgolfpc.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
          >
            <span className="w-5 h-px bg-current" />
            View full terms at SVGPC
          </a>
        </div>
      </section>

      <footer className="bg-navy px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-cream/65 hover:text-cream transition-colors"
          >
            <span className="w-5 h-px bg-current" />
            Back to Mariners Point
          </Link>
          <p className="text-sm text-cream/70">
            Questions?{" "}
            <a href="mailto:info@svgolfpc.com" className="text-gold hover:text-gold-light transition-colors">
              info@svgolfpc.com
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
