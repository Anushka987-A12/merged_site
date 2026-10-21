"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ClickSpark from "@/components/ui/ClickSpark";
import { SiteDock } from "@/components/site-dock";
import { IconBrandGithub, IconBrandInstagram } from "@tabler/icons-react";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Subsystems", href: "/subsystems" },
    { label: "Research", href: "/research" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <ClickSpark sparkColor="#ffad5e" sparkSize={10} sparkRadius={18} sparkCount={8} duration={420}>
      <div className="relative min-h-screen overflow-x-clip bg-[var(--page)] text-[var(--ink)] selection:bg-[#8b8f6b]/30">

        {/* Tactical Header Strip */}
        <header className="site-header sticky top-0 z-40">
          <div className="relative mx-auto flex max-w-[1440px] items-center justify-between px-6 py-3.5 md:px-8">
            {/* Left Brand Badge */}
            <Link href="/" className="group flex items-center gap-3.5 focus:outline-none">
              <div className="site-brand-mark relative grid h-9 w-9 place-items-center rounded-lg font-mono text-[11px] font-bold tracking-widest transition-all">
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                RVD
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="site-brand-name font-mono text-[13px] font-bold tracking-[0.26em] transition-colors">
                    R.U.G.V.E.D
                  </span>
                  <span className="hidden lg:inline-flex rounded border border-[#8b8f6b]/20 bg-[#8b8f6b]/10 px-1.5 py-0.2 font-mono text-[9px] tracking-widest text-[#8b8f6b]">
                    DEFENCE TECH
                  </span>
                </div>
                <div className="site-brand-subtitle hidden font-mono text-[10px] tracking-[0.16em] sm:block">
                  MIT MANIPAL • EST. 2016 • STUDENT DEFENCE ROBOTICS
                </div>
              </div>
            </Link>

            {/* Center Desktop Quick Links */}
            <nav className="site-nav absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full px-3 py-1 font-mono text-[11px] tracking-widest md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`site-nav-link rounded-full px-3 py-1 ${isActive ? "is-active" : ""}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Page Content Container */}
        {/* Route background slot: black placeholder for each page/subsection. */}
        <div className="relative z-10 pb-32">{children}</div>

        {/* Refined Tactical Footer */}
        <footer className="relative z-10 mx-auto max-w-[1440px] px-6 pb-28 md:px-8">
          <div className="site-footer theme-rule border-t pt-8 font-mono text-[11px] tracking-[0.16em]">
            <div className="grid gap-6 md:grid-cols-3 md:items-center">
              <div>
                <div className="font-bold text-[var(--ink)]">R.U.G.V.E.D SYSTEMS — MIT MANIPAL</div>
                <div className="mt-1 text-[10px]">Student-led robotics · Manipal, Karnataka</div>
              </div>

              <div className="flex justify-start md:justify-center items-center gap-4 text-[11px]">
                <a
                  href="https://github.com/RUGVED-Systems-MIT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-[var(--signal-accent)]"
                >
                  <IconBrandGithub className="h-4 w-4" /> GITHUB
                </a>
                <span>•</span>
                <a
                  href="https://www.instagram.com/rugved_systems"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-[var(--signal-accent)]"
                >
                  <IconBrandInstagram className="h-4 w-4" /> INSTAGRAM
                </a>
              </div>

              <div className="text-left md:text-right text-[10px]">
                <div>RUGVED SYSTEMS · © 2026</div>
                <div className="mt-0.5 text-[var(--field-accent)]">Robotics · Research · Engineering</div>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Dock Navigation */}
        <SiteDock />
      </div>
    </ClickSpark>
  );
}

export default SiteShell;
