"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandInstagram,
  IconFileText,
  IconHome,
  IconMail,
  IconTank,
  IconTrophy,
  IconUsersGroup,
} from "@tabler/icons-react";

export function SiteDock() {
  const pathname = usePathname();
  const [retracted, setRetracted] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      if (Math.abs(delta) < 8) return;
      setRetracted(y > 280 && delta > 0);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith("http")) return false;
    if (href === "/") return pathname === "/";
    const route = href.split("#")[0];
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  const items = [
    { title: "Home", icon: <IconHome className="h-full w-full" strokeWidth={1.7} />, href: "/" },
    { title: "Projects", icon: <IconTank className="h-full w-full" strokeWidth={1.7} />, href: "/projects" },
    { title: "Research", icon: <IconFileText className="h-full w-full" strokeWidth={1.7} />, href: "/projects#research" },
    { title: "Accomplishments", icon: <IconTrophy className="h-full w-full" strokeWidth={1.7} />, href: "/accomplishments" },
    { title: "Team", icon: <IconUsersGroup className="h-full w-full" strokeWidth={1.7} />, href: "/team" },
    { title: "Contact", icon: <IconMail className="h-full w-full" strokeWidth={1.7} />, href: "/contact" },
    { title: "Instagram", icon: <IconBrandInstagram className="h-full w-full" strokeWidth={1.7} />, href: "https://www.instagram.com/rugved_systems" },
  ].map((item) => ({ ...item, active: isActive(item.href) }));

  return (
    <nav
      className={`site-dock${retracted ? " is-retracted" : ""}`}
      aria-label="Quick navigation"
      onFocusCapture={() => setRetracted(false)}
    >
      <FloatingDock items={items} />
    </nav>
  );
}

export default SiteDock;
