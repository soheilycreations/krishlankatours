"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function HorizontalScroller({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-card]")?.clientWidth ?? 320;
    el.scrollBy({ left: dir * (cardWidth + 24), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hidden scroll-smooth snap-x snap-mandatory pb-2"
      >
        {children}
      </div>

      <div className="hidden sm:flex items-center justify-end gap-2 mt-6">
        <button
          onClick={() => scrollBy(-1)}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className="w-10 h-10 rounded-full border border-navy/15 flex items-center justify-center text-navy hover:bg-blue hover:text-white hover:border-blue transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-navy"
        >
          <ArrowLeft size={17} />
        </button>
        <button
          onClick={() => scrollBy(1)}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className="w-10 h-10 rounded-full bg-blue flex items-center justify-center text-white hover:bg-blue-light transition-colors disabled:opacity-30"
        >
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
