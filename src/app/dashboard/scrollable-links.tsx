"use client";

import { useState, useRef, useEffect } from "react";
import { LinkList } from "./link-list";

interface Link {
  id: string;
  title: string;
  url: string;
  imageUrl: string | null;
  active: boolean;
  order: number;
}

interface ScrollableLinksProps {
  links: Link[];
}

export function ScrollableLinks({ links }: ScrollableLinksProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowTopGradient(scrollTop > 10);
      setShowBottomGradient(scrollTop + clientHeight < scrollHeight - 10);
    };

    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, [links]);

  return (
    <div className="relative">
      {showTopGradient && (
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-card to-transparent pointer-events-none z-10" />
      )}
      <div
        ref={scrollRef}
        className="max-h-[280px] overflow-y-auto pr-1 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <LinkList links={links} />
      </div>
      {showBottomGradient && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      )}
    </div>
  );
}
