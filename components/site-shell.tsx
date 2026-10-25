"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ClickSpark from "@/components/ui/ClickSpark";
import { ScrollProgress } from "@/components/scroll-progress";
import { IconBrandGithub, IconBrandInstagram, IconMenu2, IconX } from "@tabler/icons-react";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navLinks = [
    { label: "About", href: "/#about", route: "/", key: "about" },
    { label: "Projects", href: "/projects", route: "/projects", key: "projects" },
    { label: "Subsystems", href: "/subsystems", route: "/subsystems", key: "subsystems" },
    { label: "Team", href: "/team", route: "/team", key: "team" },
    { label: "Accomplishments", href: "/accomplishments", route: "/accomplishments", key: "accomplishments" },
    { label: "Contact", href: "/contact", route: "/contact", key: "contact" },
  ];
  const isActive = (route: string) => route === "/" ? pathname === "/" : pathname.startsWith(route);
  const renderNavLinks = (mobile = false) => navLinks.map((link) => (
    <Link
      key={link.key}
      href={link.href}
      aria-current={isActive(link.route) ? "page" : undefined}
      className={`site-primary-nav__link${isActive(link.route) ? " is-active" : ""}`}
      onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
    >
      {link.label}
    </Link>
  ));

  return (
    <ClickSpark sparkColor="#ffad5e" sparkSize={10} sparkRadius={18} sparkCount={8} duration={420}>
      <div className="site-shell relative min-h-screen overflow-x-clip bg-[var(--page)] text-[var(--ink)] selection:bg-[#8b8f6b]/30">
        <ScrollProgress />

        {/* Tactical Header Strip */}
        <header className="site-header sticky top-0 z-40">
          <div className="site-header__inner mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-8">
            <Link href="/" aria-label="RUGVED home" className="site-header__brand group flex items-center gap-2.5">
              <Image
                src="/pictures/RUGVED_removedBG.png"
                alt=""
                width={38}
                height={38}
                priority
                className="site-header__logo"
              />
              <span className="site-brand-name">R.U.G.V.E.D</span>
            </Link>

            <nav className="site-primary-nav" aria-label="Main navigation">
              {renderNavLinks()}
            </nav>

            <button
              type="button"
              className="site-menu-toggle"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="site-mobile-nav"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <IconX aria-hidden="true" /> : <IconMenu2 aria-hidden="true" />}
            </button>
          </div>
          <nav
            id="site-mobile-nav"
            className={`site-mobile-nav${mobileMenuOpen ? " is-open" : ""}`}
            aria-label="Mobile navigation"
            aria-hidden={!mobileMenuOpen}
          >
            {renderNavLinks(true)}
          </nav>
        </header>

        {/* Page Content Container */}
        {/* Route background slot: black placeholder for each page/subsection. */}
        <div className="relative z-10 pb-32">{children}</div>

        {/* Refined Tactical Footer */}
        <footer className="relative z-10 mx-auto max-w-[1440px] px-6 pb-28 md:px-8">
          <div className="site-footer theme-rule border-t pt-6 font-mono text-[11px] tracking-[0.14em]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-bold text-[var(--ink)]">R.U.G.V.E.D SYSTEMS — MIT MANIPAL</div>
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

              <div className="text-left text-[10px] sm:text-right">
                <div>© 2026 RUGVED SYSTEMS</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ClickSpark>
  );
}

export default SiteShell;
