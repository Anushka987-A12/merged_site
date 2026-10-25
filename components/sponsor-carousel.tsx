"use client";

import Image from "next/image";
import { useRef } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const SPONSORS = [
  { name: "BATEMO GmbH", image: "/sponsor-batemo.svg" },
  { name: "LUXONIS", image: "/sponsor-luxonis.svg" },
  { name: "SimScale", image: "/sponsor-simscale.svg" },
  { name: "Vector Technics", image: "/sponsor-vector-technics.svg" },
  { name: "ANSYS", image: "/sponsor-ansys.svg" },
];

export function SponsorCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>(".sponsor-carousel__card");
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const distance = (card?.getBoundingClientRect().width ?? track.clientWidth) + gap;
    track.scrollBy({
      left: direction * distance,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  return (
    <div className="sponsor-carousel">
      <div
        className="sponsor-carousel__track"
        ref={trackRef}
        role="region"
        aria-label="RUGVED sponsors"
        tabIndex={0}
      >
        {SPONSORS.map((sponsor) => (
          <div className="sponsor-carousel__card" key={sponsor.name}>
            <Image
              src={sponsor.image}
              alt={`${sponsor.name} sponsor`}
              width={340}
              height={180}
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className="sponsor-carousel__controls" aria-label="Carousel controls">
        <button type="button" aria-label="Previous sponsors" onClick={() => move(-1)}>
          <IconChevronLeft aria-hidden="true" />
        </button>
        <button type="button" aria-label="Next sponsors" onClick={() => move(1)}>
          <IconChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
