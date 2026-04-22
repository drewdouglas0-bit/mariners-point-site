"use client";

import { useEffect, useState } from "react";

const ORDER_URL = "https://my-site-100783-102620.square.site/s/order";

export function BirdiesOrderFloat() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("birdies-hero");
      if (!hero) return;
      const { bottom } = hero.getBoundingClientRect();
      setShow(bottom < 120);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!show) return null;

  return (
    <a
      href={ORDER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-3 sm:right-6 bottom-3 sm:bottom-6 z-40 inline-flex items-center gap-2 min-h-[44px] max-w-[calc(100vw-1.5rem)] rounded-full bg-birdies-brass text-birdies-navy px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.35)] hover:bg-[#c69b58] transition-colors"
    >
      Order Ahead
      <span aria-hidden="true">↗</span>
    </a>
  );
}
