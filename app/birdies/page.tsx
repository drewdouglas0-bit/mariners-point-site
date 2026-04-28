import type { Metadata } from "next";
import Link from "next/link";
import { BirdiesOrderFloat } from "../components/BirdiesOrderFloat";

const ORDER_URL = "https://my-site-100783-102620.square.site/s/order";

export const metadata: Metadata = {
  title: "Birdie's at Mariners Point — Bar & Grill Foster City",
  description:
    "Smashburgers, street tacos, cold beer, and a full bar. Birdie's at Mariners Point is your 19th hole on San Francisco Bay.",
};

type MenuItem = {
  name: string;
  price?: string;
  description?: string;
  note?: string;
};

type MenuSection = {
  title: string;
  subtitle?: string;
  items: MenuItem[];
  notes?: string[];
  columns?: 1 | 2;
};

const menuSections: MenuSection[] = [
  {
    title: "Birdie's Specialties",
    items: [
      {
        name: "Birdie's Smashburger",
        price: "$10.95",
        description: "Angus beef, American cheese, onions, pickles, house sauce",
        note: "Double patty +$3.95",
      },
      {
        name: "Jumbo Hot Dog",
        price: "$8.95",
        note: "Make it a chili cheese dog +$3.95",
      },
      {
        name: "Fish Filet Sandwich",
        price: "$10.95",
        description: "Crispy cod, American cheese, tartar sauce",
      },
      {
        name: "Chicken Caesar Wrap",
        price: "$12.95",
        description:
          "Romaine lettuce, grilled chicken, parmesan cheese, Caesar dressing, wrapped in a large flour tortilla",
      },
      {
        name: "Grilled Chicken Sandwich",
        price: "$10.95",
        description: "Shredded lettuce, pickles, comeback sauce",
      },
      {
        name: "Chicken Tenders (served with Birdie's ranch or BBQ)",
        description:
          "2 pieces with fries — $9.95 · 3 pieces with fries — $11.95 · 6 pieces with fries — $22.95",
      },
      {
        name: "Local Handmade Pizza (large slice / whole pie)",
        description:
          "Cheese — $4.95 / $24 · Pepperoni — $5.95 / $29 · BBQ Chicken — $5.95 / $29",
        note: "Spicy BBQ chicken, onions, cilantro, BBQ sauce",
      },
    ],
  },
  {
    title: "Snacks",
    columns: 2,
    items: [
      {
        name: "House Guacamole with Handcut Chips",
        price: "$8.95",
      },
      {
        name: "Chicken and Cheese Taquitos",
        price: "$8.95",
        description: "4 taquitos with red salsa and sour cream",
      },
      {
        name: "House Nachos",
        price: "$11.95",
        description:
          "Jack cheese blend, mayocoba beans, pico de gallo, onions, cilantro",
      },
      {
        name: "Cup of Chili",
        price: "$8.95",
        description: "Spicy beef chili, jack cheese blend, onions",
      },
      {
        name: "French Fries or Tater Tots",
        price: "$4.95",
      },
      {
        name: "Chicken Wings",
        price: "$12.95",
        description: "6 crispy bone-in wings, ranch/BBQ/buffalo",
      },
      {
        name: "Bag of Handcut Tortilla Chips & Salsa",
        price: "$3.95",
      },
      {
        name: "Kettle Chips",
        price: "$2.95",
      },
    ],
  },
  {
    title: "Suavecito Menu",
    subtitle: "Inside Birdie's",
    items: [
      {
        name: "Quesabirria (2 per order)",
        price: "$12.95",
        description:
          "Corn tortillas dipped in beef jus and grilled crisp; stuffed with braised beef birria, onion, cilantro, and jack cheese blend",
      },
      {
        name: "Burrito Bowl",
        price: "$15.95",
        description:
          "Red rice, mayocoba beans, romaine lettuce, shredded cheese, guacamole, sour cream, house pico de gallo, tortilla chips",
        note: "Choice of: BBQ chicken, carne asada, or spicy cauliflower & mushrooms",
      },
      {
        name: "Suavecito Street Tacos",
        description: "With onions, cilantro, and salsa",
        note:
          "BBQ Chicken or Spicy Cauliflower & Mushroom — $4.75 · Carne Asada Steak — $5.45 · Crispy Fish Taco — $6.45",
      },
      {
        name: "Add-ons",
        description: "Make it a super taco +$2 · Add rice + beans or chips +$3",
      },
    ],
  },
  {
    title: "Pizza (Whole Pie — 8 Slices)",
    columns: 2,
    items: [
      { name: "Cheese", price: "$24.00" },
      { name: "Pepperoni", price: "$29.00" },
      { name: "BBQ Chicken", price: "$29.00" },
      { name: "Veggie", price: "$27.00" },
    ],
  },
  {
    title: "Beer — Can",
    columns: 2,
    items: [
      { name: "Coors / Coors Light 16oz", price: "$5" },
      { name: "Coors / Coors Light 24oz", price: "$7" },
      { name: "Bud / Bud Light 25oz", price: "$7" },
      { name: "PBR 24oz", price: "$7" },
      { name: "Guinness 14.9oz", price: "$7" },
      { name: "Heineken 16oz", price: "$7" },
      { name: "Sierra Nevada Pale Ale 16oz", price: "$7" },
      { name: "805 16oz", price: "$7" },
      { name: "Trumer Pils 19.2oz", price: "$8" },
      { name: "Dos Equis Lager Especial 24oz", price: "$10" },
      { name: "Elysian Contact Haze IPA 19.2oz", price: "$10" },
      { name: "Modelo Especial 24oz", price: "$10" },
      { name: "Stella 25oz", price: "$10" },
      { name: "Fort Point IPA 19.2oz", price: "$10" },
    ],
  },
  {
    title: "Beer — Bottle",
    subtitle: "All $5",
    items: [
      {
        name: "Bud · Bud Light · Miller High Life · Michelob Ultra · Lone Star · Coors Light · Corona · Heineken 00 N/A · Stella 00 N/A",
      },
    ],
  },
  {
    title: "Beer — Draft",
    columns: 2,
    items: [
      { name: "Michelob Ultra", price: "$6" },
      { name: "Modelo Especial", price: "$8" },
      { name: "805", price: "$8" },
      { name: "Stella", price: "$8" },
      { name: "Kona Big Wave", price: "$8" },
      { name: "Elysian Contact Haze IPA", price: "$8" },
      { name: "Elysian Space Dust IPA", price: "$8" },
      { name: "Deschutes Fresh Squeezed IPA", price: "$8" },
    ],
  },
  {
    title: "Seltzers & Cider",
    columns: 2,
    items: [
      { name: "Golden State Cider", price: "$9" },
      { name: "Nütrl Vodka Seltzer", price: "$8" },
      { name: "High Noon Seltzer", price: "$8" },
      { name: "Cutwater Transfusion", price: "$8" },
      { name: "Los Sundays Tequila Seltzer", price: "$8" },
    ],
  },
  {
    title: "Wine",
    columns: 2,
    items: [
      { name: "Josh Chardonnay", price: "$9" },
      { name: "Josh Sauvignon Blanc", price: "$9" },
      { name: "Josh Cabernet Sauvignon", price: "$9" },
      { name: "Josh Pinot Noir", price: "$9" },
      { name: "Josh Sparkling", price: "$10" },
      { name: "The Beach Rosé", price: "$10" },
    ],
  },
  {
    title: "Vodka",
    items: [
      {
        name: "Absolut $9 · Stoli $9 · Ketel One $10 · Ketel One Citron $10 · Tito's $10 · Grey Goose $11",
      },
      { name: "+Add Red Bull or Ginger Beer $2" },
    ],
  },
  {
    title: "Tequila",
    items: [
      {
        name: "Hornitos Reposado $9 · Cazadores Reposado $10 · Cazadores Añejo $11 · Patrón Silver $12 · Teremana Añejo $12 · Casamigos Añejo $15",
      },
    ],
  },
  {
    title: "Whiskey",
    items: [
      {
        name: "Seagrams 7 $9 · Jack Daniel's $9 · Maker's Mark $10 · Basil Hayden $13 · Crown Royal $9 · Jameson $9 · Bulleit Bourbon or Rye $10 · Woodford Reserve $10",
      },
    ],
  },
  {
    title: "Scotch & More",
    items: [
      {
        name: "Johnny Walker Red $9 · Johnny Walker Black $10 · Johnny Walker Double Black $11 · Fernet $9 · Jäger $9 · Hennessy $13",
      },
    ],
  },
  {
    title: "Gin",
    items: [
      {
        name: "Aviation $9 · Tanqueray $9 · Beefeater $9 · Bombay Sapphire $9 · Hendrick's $10",
      },
    ],
  },
  {
    title: "Rum",
    items: [
      {
        name: "Bacardi $9 · Captain Morgan $9 · Malibu $9 · Myer's $9 · Ron Zacapa 23yr $11",
      },
    ],
  },
  {
    title: "Non-Alcoholic",
    columns: 2,
    items: [
      { name: "Soda (Coke, Diet, Sprite)", price: "$3" },
      { name: "Iced Tea", price: "$2" },
      { name: "Lemonade", price: "$3" },
      { name: "Juice", price: "$3" },
      { name: "Bottled Water", price: "$2" },
      { name: "Coffee or Hot Tea", price: "$2" },
      { name: "Gatorade", price: "$4" },
      { name: "Ginger Beer", price: "$4" },
      { name: "Red Bull", price: "$4" },
      { name: "Suavecito Aguas Frescas 16oz", price: "$5.50" },
      { name: "Solstice Iced Teas 16oz", price: "$5.00" },
      { name: "Bottled Water 12oz", price: "$2.00" },
      { name: "Canned Coca-Cola Products 12oz", price: "$2.50" },
    ],
  },
  {
    title: "Party Trays & Large Format",
    subtitle: "48-hour advance order required",
    items: [
      {
        name: "Handcut Chips and Housemade Salsa",
        description: "Green Tomatillo Avocado Salsa or Spicy House Red",
        note: "Pint with half tray of chips — $18.95 · Quart with full tray of chips — $34.95",
      },
      {
        name: "House Guacamole, Salsa and Handcut Chips",
        description:
          "Pint with half tray of chips — $29.95 · Quart with full tray of chips — $45.95 · Half pan — $99.95",
      },
      {
        name: "Crispy Chicken and Cheese Taquitos",
        price: "$27.95 per dozen",
        description: "Served with house salsa and sour cream",
      },
      {
        name: "French Fries",
        price: "$19.95",
        description: "Half tray, serves 6-8",
      },
      {
        name: "Tater Tots",
        price: "$19.95",
        description: "Half tray, serves 6-8",
      },
      {
        name: "50/50 Fries and Tots",
        price: "$19.95",
        description: "Half tray, serves 6-8",
      },
      {
        name: "Classic Caesar Salad",
        price: "$32.95",
        description: "Half tray, serves 4-6",
        note: "With Chipotle BBQ Chicken — $45.95 · With Chopped Chicken Tenders — $45.95",
      },
      {
        name: "Birdie's Pizza, 8 Slices per Whole Pie",
        description:
          "Cheese — $24.00 · Pepperoni — $29.00 · BBQ Chicken — $29.00 · Veggie — $27.00",
      },
      {
        name: "Crispy Chicken Tenders",
        description:
          "With housemade ranch and BBQ sauce · 16 pc — $45.95 · 24 pc — $64.95",
      },
      {
        name: "Quesabirria Tacos (6)",
        price: "$33.95",
        description:
          "Stuffed with prime braised beef birria, jack cheese blend, onions, and cilantro",
        note: "Served with salsa verde and consommé",
      },
      {
        name: "Suavecito Street Tacos (6)",
        description: "Onions, cilantro, salsa",
        note:
          "Carne Asada — $29.95 · Chipotle BBQ Chicken — $26.95 · Spicy Cauliflower and Mushroom — $26.95 · Crispy Fish — $35.95",
      },
      {
        name: "Birdie's Smashburgers",
        description:
          "6-pack — $59.95 · Dozen — $119.95 · Angus beef, American cheese, onions, pickles, house sauce",
      },
      {
        name: "Jumbo All Beef Hot Dog",
        description: "6-pack — $45.95 · Dozen — $89.95",
      },
      {
        name: "Full bar, beer and wine options available a.q.",
      },
    ],
  },
];

function MenuSectionCard({ section }: { section: MenuSection }) {
  return (
    <section className="border border-[#2b3f55] bg-[#162b40] p-6 sm:p-8">
      <div className="mb-6 border-b border-[#31465c] pb-4">
        <h2 className="text-3xl sm:text-4xl font-birdies text-birdies-cream leading-tight">
          {section.title}
        </h2>
        {section.subtitle && (
          <p className="text-birdies-brass text-xs tracking-[0.2em] uppercase mt-2">
            {section.subtitle}
          </p>
        )}
      </div>

      <div className={section.columns === 2 ? "md:columns-2 md:gap-8" : ""}>
        {section.items.map((item) => (
          <article key={`${section.title}-${item.name}`} className="mb-5 break-inside-avoid">
            <div className="flex items-end gap-3 min-w-0">
              <h3 className="flex-1 min-w-0 text-birdies-cream text-base sm:text-lg leading-snug font-semibold">
                {item.name}
              </h3>
              {item.price && (
                <>
                  <span className="flex-1 h-px border-b border-dotted border-birdies-cream/30 mb-1" />
                  <span className="text-birdies-brass font-semibold whitespace-nowrap">
                    {item.price}
                  </span>
                </>
              )}
            </div>

            {item.description && (
              <p className="text-birdies-cream/75 text-sm leading-relaxed mt-1.5">
                {item.description}
              </p>
            )}

            {item.note && (
              <p className="text-birdies-brass/90 text-xs leading-relaxed mt-2 uppercase tracking-[0.08em]">
                {item.note}
              </p>
            )}
          </article>
        ))}
      </div>

      {section.notes && (
        <div className="mt-6 border-t border-[#31465c] pt-4 space-y-2">
          {section.notes.map((note) => (
            <p key={note} className="text-birdies-cream/70 text-sm">
              {note}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}

export default function BirdiesPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#213c58_0%,#13263a_38%,#0f1d2e_100%)] text-birdies-cream">
      <BirdiesOrderFloat />
      <div className="pt-20 border-b border-birdies-cream/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-birdies-cream/70 hover:text-birdies-cream transition-colors"
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
            >
              <line x1="12" y1="7" x2="2" y2="7" />
              <polyline points="6 3 2 7 6 11" />
            </svg>
            Back to Mariners Point
          </Link>
        </div>
      </div>

      <section
        id="birdies-hero"
        className="py-14 md:py-20 px-6 border-b border-birdies-cream/10"
      >
        <div className="max-w-6xl mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/birdies-logo.png"
            alt="Birdie's at Mariners Point logo"
            className="h-20 md:h-24 w-auto mb-6"
          />
          <p className="text-birdies-brass tracking-[0.26em] text-xs uppercase mb-3">
            Est. 2022
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-birdies mb-4 text-birdies-cream">
            Birdie&apos;s at Mariners Point
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-birdies-cream/85 font-birdies">
            Good food, cold beer, and your seat after the round.
          </p>
          <p className="mt-6 max-w-2xl text-birdies-cream/75 leading-relaxed">
            Birdie&apos;s is the neighborhood bar and grill inside Mariners Point Golf
            Center. It is built for golfers, families, and regulars who want a
            great burger, tacos done right, and a drink with a Bay breeze still
            on your sleeves.
          </p>
          <a
            href={ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 min-h-[44px] bg-birdies-brass text-birdies-navy px-6 py-3 text-xs sm:text-sm font-bold tracking-[0.18em] uppercase hover:bg-[#c69b58] transition-colors"
          >
            Order Ahead
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="px-6 py-10 md:py-14 pb-24 md:pb-14">
        <div className="max-w-6xl mx-auto space-y-8">
          {menuSections.map((section) => (
            <MenuSectionCard key={section.title} section={section} />
          ))}
        </div>
      </section>

      <footer className="border-t border-birdies-cream/15 px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="border border-birdies-cream/20 bg-[#102336] p-5">
            <p className="text-sm text-birdies-cream/85">
              $5 minimum required for credit card purchases
            </p>
            <p className="text-sm text-birdies-cream/85 mt-2">
              18% gratuity will be added to credit card tabs not closed
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-birdies-cream/75 hover:text-birdies-brass transition-colors"
          >
            <span className="w-5 h-px bg-current" />
            Back to Mariners Point
          </Link>
        </div>
      </footer>
    </main>
  );
}
