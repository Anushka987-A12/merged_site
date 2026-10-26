"use client";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconHome,
  IconTank,
  IconFileText,
  IconMail,
  IconBrandInstagram,
  IconTrophy,
  IconUsersGroup,
} from "@tabler/icons-react";

export function SiteDock() {
  const items = [
    { title: "Home", icon: <IconHome className="h-full w-full text-[var(--field-accent)]" />, href: "/" },
    { title: "Projects", icon: <IconTank className="h-full w-full text-[var(--field-accent)]" />, href: "/projects" },
    { title: "Research", icon: <IconFileText className="h-full w-full text-[var(--field-accent)]" />, href: "/projects#research" },
    { title: "Accomplishments", icon: <IconTrophy className="h-full w-full text-[var(--field-accent)]" />, href: "/accomplishments" },
    { title: "Team", icon: <IconUsersGroup className="h-full w-full text-[var(--field-accent)]" />, href: "/team" },
    { title: "Contact", icon: <IconMail className="h-full w-full text-[var(--field-accent)]" />, href: "/contact" },
    { title: "Instagram", icon: <IconBrandInstagram className="h-full w-full text-[var(--field-accent)]" />, href: "https://www.instagram.com/rugved_systems" },
  ];
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <FloatingDock items={items} />
    </div>
  );
}
