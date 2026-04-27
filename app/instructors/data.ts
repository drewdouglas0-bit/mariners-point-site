export interface RateTable {
  label?: string;
  rows: { duration: string; price: string }[];
}

export interface Instructor {
  slug: string;
  name: string;
  initials: string;
  photo?: string; // filename in /public, e.g. "joby-2020.jpg"
  headline: string;
  yearsTeaching: string;
  profileComingSoon?: boolean;
  bio: string;
  quote?: { text: string; attribution: string };
  currentPackage?: { label: string; price: string; description: string };
  rateTables: RateTable[];
  ratesNote?: string;
  scheduleLines?: string[];
  certifications?: string[];
  lessonIncludes?: string[];
  instagram?: string;
  twitter?: string;
  email?: string;
  website?: string;
  phone?: string;
  primaryWebsiteCtaLabel?: string;
}

export const instructors: Instructor[] = [
  {
    slug: "joby-ross",
    name: "Joby Ross",
    initials: "JR",
    photo: "joby-2020.jpg",
    headline: "PGA Class A Professional · Jim McLean Master Instructor",
    yearsTeaching: "Since 1996",
    bio: `PGA of America Class "A" member with 25+ years of teaching experience. Previously taught at Burlingame Country Club and Peninsula Golf and Country Club. Led the Jim McLean Golf Academy at Mariners Point, where he trained directly under Jim McLean and earned Master Instructor status.

Voted a Top 50 Instructor in California by Golf Digest and nominated for Teacher of the Year in the Northern California PGA section. His teaching follows the Jim McLean system — systematic, parameter-based swing improvement — but always tailored to each student's needs and goals. Video included in every lesson. Has worked with everyone from novices to tour professionals.`,
    quote: {
      text: "Joby is a proven, world class golf instructor… It is rare to find someone with all the qualities I have witnessed with Joby Ross.",
      attribution: "Jim McLean",
    },
    rateTables: [
      {
        rows: [
          { duration: "½ hour", price: "$90" },
          { duration: "Three ½ hour lessons", price: "$230" },
          { duration: "Five ½ hour lessons", price: "$375" },
          { duration: "1 hour", price: "$170" },
          { duration: "Three 1 hour lessons", price: "$450" },
          { duration: "Five 1 hour lessons", price: "$750" },
        ],
      },
    ],
    scheduleLines: [
      "Tue – Fri  ·  8:30 AM – 5:30 PM",
      "Saturday  ·  8:30 AM – 4:00 PM",
      "Sun & Mon  ·  Off",
    ],
  },

  {
    slug: "mark-cato",
    name: "Mark Cato",
    initials: "MC",
    photo: "mark-cato-2017.jpg",
    headline: "Trained with Jim McLean and David Leadbetter · Former Tour player",
    yearsTeaching: "Since 1987",
    bio: `Ranked among the top instructors in Northern California, Mark trained with two of the world's most renowned coaches — Jim McLean and David Leadbetter. He teaches Jim McLean's "8 Step Swing" method, a systematic approach with eight key checkpoints suitable for beginner through advanced golfers. Uses training aids, video, and computer analysis to accelerate student progress.

Mark is also a former competitive player who competed on the Nationwide and PGA Tours from 1990–1996, and the Australasian PGA Tour from 1991–1993, sharing fairways with Vijay Singh, Greg Norman, Stuart Appleby, Robert Allenby, Michael Campbell, and Shingo Katayama.`,
    currentPackage: {
      label: "Current Package",
      price: "$550",
      description: "Five one-hour lessons — Mark's recommended starting block for new students.",
    },
    rateTables: [
      {
        label: "Adults & Juniors",
        rows: [
          { duration: "Three 1 hour lessons", price: "$400" },
          { duration: "Five 1 hour lessons", price: "$550" },
        ],
      },
    ],
    scheduleLines: [
      "Mon – Thu  ·  11:00 AM – 8:00 PM",
      "Sat – Sun  ·  10:00 AM – 7:00 PM",
      "Friday  ·  Off",
    ],
    email: "markcato7@yahoo.com",
    phone: "(650) 766-1516",
  },

  {
    slug: "stuart-brownlee",
    name: "Stuart Brownlee",
    initials: "SB",
    photo: "stuart.jpg",
    headline: "Jim McLean Academy trained · Teaching since 1999",
    yearsTeaching: "Since 1999",
    bio: `Stuart began competing in amateur tournaments in 1987 and played at Cañada College, where he won the U.S. Two Ball Collegiate Division — the only Junior College player ever to win the event. His instructional career began in 1996 at the San Geronimo Golf School, and in 1997 he joined the Jim McLean Golf Academy in Foster City, training under Jim McLean Master Instructors.

Stuart works with new and advanced players alike, using video analysis and training aids to address each student's specific swing issues with a strong emphasis on fundamentals. In addition to private lessons, Stuart offers Junior Workshops (ages 10–15) and group classes through Foster City.`,
    rateTables: [
      {
        rows: [
          { duration: "½ hour", price: "$80" },
          { duration: "Three ½ hour", price: "$220" },
          { duration: "Five ½ hour", price: "$350" },
          { duration: "1 hour", price: "$150" },
          { duration: "Three 1 hour", price: "$420" },
          { duration: "Five 1 hour", price: "$650" },
        ],
      },
    ],
    scheduleLines: [
      "Monday  ·  10:00 AM – 2:00 PM",
      "Tue – Fri  ·  7:30 AM – 2:00 PM",
      "Sat – Sun  ·  7:00 AM – 2:00 PM",
    ],
  },

  {
    slug: "ron-sagara",
    name: "Ron Sagara",
    initials: "RS",
    photo: "ron.jpg",
    headline: "PGA Class A · Modern Day Coach · At Mariners Point since 1996",
    yearsTeaching: "Since 1996",
    bio: `Born and raised on Oahu, Ron grew up surfing Waikiki Beach and playing golf with his dad at a course just blocks from the sand. After relocating to the Bay Area in the early 1980s and a successful corporate marketing career at Levi Strauss & Co. in San Francisco, Ron enrolled in the PGA of America Golf Management Program in Port St. Lucie, Florida. After four years of academic training, he was elected as a PGA "Class A" Teaching Professional.

Ron's teaching philosophy is suited for the committed player seeking more consistency and a deeper understanding of the swing. He doesn't offer quick fixes — instead, he prescribes structured regimens that, practiced regularly, deliver measurable improvement.`,
    certifications: [
      "PGA Class A Teaching Professional",
      "Certified PGA Modern Day Coach",
      "PGA American Development Model (ADM) Coach",
      "U.S. Kids Golf Certified Instructor",
      "Positive Coaching Alliance Certified Double Goal Coach",
    ],
    lessonIncludes: [
      "Detailed swing video using Skillest analytical tool",
      "Pre-swing setup analysis — grip, posture, alignment",
      "In-swing analysis with checkpoints P1 (setup) through P10 (finish)",
      "Customized drills tailored to integrate any required changes",
    ],
    rateTables: [
      {
        rows: [
          { duration: "½ hour", price: "$80" },
          { duration: "Three ½ hour lessons", price: "$220" },
          { duration: "1 hour", price: "$150" },
        ],
      },
    ],
    instagram: "ronsagara.golf",
  },

  {
    slug: "gary-monisteri",
    name: "Gary Monisteri",
    initials: "GM",
    photo: "garymonisteri_1.jpg",
    headline: "PGA Class A · 30+ years teaching in the Bay Area",
    yearsTeaching: "30+ years",
    bio: `Gary is a PGA "Class A" golf instructor who's been teaching in the San Francisco Bay Area for over 30 years. He has taught at San Mateo Muni, Poplar Creek, Burlingame Golf Center, and Stanford University.

His philosophy: guide people to have fun while playing golf — usually the better they get, the more fun they have. Gary helps students find their best swing in the most uncomplicated way possible and teaches everything needed to enjoy the game: etiquette, rules, psychology, course management, practice techniques, short game, and full-swing fundamentals.`,
    rateTables: [],
    ratesNote: "Contact Gary directly for current rates.",
    scheduleLines: ["Sundays and Mondays"],
    email: "golflessons@garymonisteri.com",
    website: "garymonisteri.com",
  },

  {
    slug: "josh-willard",
    name: "Josh Willard",
    initials: "JW",
    photo: "josh-willard-pic_1.jpg",
    headline: "PGA of Australia Class A · Coached on European Tour",
    yearsTeaching: "Coaching since 2002",
    bio: `A Class A member of the PGA of Australia since 1995, Josh competed on the Australian, Asian, and South African PGA Tours before transitioning to coaching in 2002. Since then he has worked at elite facilities around the world: The Australian Golf Club, Gary Player Golf Academy in Singapore, Singapore Island Country Club, and Linzer Golfclub Luftenberg in Austria.

He has coached every level from beginners to European Tour professionals, and uses state-of-the-art swing analysis software to identify problem areas and build a targeted plan for each player.`,
    rateTables: [
      {
        label: "Adult",
        rows: [
          { duration: "60 min", price: "$200" },
          { duration: "3 × 60 min", price: "$570" },
          { duration: "5 × 60 min", price: "$850" },
          { duration: "10 × 60 min", price: "$1,500" },
        ],
      },
      {
        label: "Junior",
        rows: [
          { duration: "60 min", price: "$150" },
          { duration: "3 × 60 min", price: "$420" },
          { duration: "5 × 60 min", price: "$650" },
          { duration: "10 × 60 min", price: "$1,200" },
        ],
      },
    ],
    ratesNote: "Each additional person +$50.",
  },

  {
    slug: "dennis-mitchell",
    name: "Dennis Mitchell",
    initials: "DM",
    photo: "dennis-mitchell-orig_orig.jpg",
    headline: "40+ years teaching · Trained at Doral under Jim McLean",
    yearsTeaching: "40+ years",
    bio: `Dennis brings over forty years of experience as a golf instructor, club fitter, and business owner. His approach is comprehensive — addressing full swing, short game, course management, practice techniques, mental training, golf fitness, and properly fitted equipment.

As an instructor at the Doral Resort and Spa in Miami, he learned world-class instruction from Jim McLean, one of the world's top 100 teachers. Throughout his career, Dennis has worked with players on the PGA Tour, DP World Tour, LPGA, Korn Ferry Tour, and at the collegiate, amateur, and junior levels. He still competes, with tournament victories at the junior, amateur, and professional levels.

Dennis believes the golf swing can't be standardized — he develops each student's swing around their unique capabilities and improves on what's already there. His mantra: emphasize the "FUN" in fundamentals.`,
    rateTables: [],
    ratesNote: "Contact Dennis directly for current rates.",
    email: "dmitchellgolf@gmail.com",
    phone: "650-769-7669",
  },
  {
    slug: "matt-coe",
    name: "Matt Coe",
    initials: "MC",
    photo: "matt-coe.jpg",
    headline: "10x World Top 100 Club Fitter · Former NCAA & NCIA Golf Coach",
    yearsTeaching: "Since 1987",
    bio: `Matt has been teaching golf since 1987 and is a 10-time World Top 100 club fitter — one of the most recognized club fitting credentials in the game. He is a former NCAA and NCIA golf coach, bringing structured competitive coaching experience to players of all levels.`,
    rateTables: [],
    ratesNote: "Contact Matt directly for current rates — call (650) 685-2000",
    scheduleLines: ["Contact Matt directly to schedule a lesson"],
    phone: "(650) 685-2000",
    email: "golfprocoe@mail.com",
    twitter: "coesign",
  },
  {
    slug: "kelvin-kelley",
    name: "Kelvin Kelley",
    initials: "KK",
    photo: "kelvin-kelley-300x296.jpg",
    headline: "Golf Instructor at Mariners Point",
    yearsTeaching: "Mariners Point Instructor",
    profileComingSoon: true,
    bio: `Profile coming soon. Visit kelleygolf.com for more information.`,
    rateTables: [],
    website: "kelleygolf.com",
  },
  {
    slug: "bob-wang",
    name: "Bob Wang",
    initials: "BW",
    photo: "bob-wang_orig.jpg",
    headline: "Golf Instructor at Mariners Point",
    yearsTeaching: "Mariners Point Instructor",
    bio: `For rates, scheduling, and full instructor information, visit Bob's website.`,
    rateTables: [],
    website: "https://impackgolf.com/",
    primaryWebsiteCtaLabel: "Visit impackgolf.com",
  },
];

export function getInstructor(slug: string): Instructor | undefined {
  return instructors.find((i) => i.slug === slug);
}
