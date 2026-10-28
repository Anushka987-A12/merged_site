"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { IconArrowUpRight, IconMail, IconMapPin } from "@tabler/icons-react";
import { SectionAtmosphere } from "@/components/section-atmosphere";

const CONTACTS = [
  {
    label: "TEAM EMAIL",
    value: "rugved.mit@manipal.edu",
    href: "mailto:rugved.mit@manipal.edu",
    icon: IconMail,
  },
  {
    label: "BASED AT",
    value: "Manipal Institute of Technology, Manipal, Karnataka, India",
    href: "https://rugved.co.in/",
    icon: IconMapPin,
  },
];

export default function ContactPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const mailSubject = `[RUGVED website] ${subject || "General enquiry"}${name ? ` — ${name}` : ""}`;
    const mailBody = [
      name && `Name: ${name}`,
      email && `Email: ${email}`,
      "",
      message || "Hello RUGVED team,",
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:rugved.mit@manipal.edu?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  }

  return (
    <main
      data-background-slot="contact"
      className="contact-page relative isolate mx-auto min-h-screen max-w-[1360px] px-5 pb-24 pt-10 md:px-10 md:pt-16"
    >
      <SectionAtmosphere variant="contact" />

      <header className="contact-heading">
        <h1 className="font-commissioner text-5xl font-bold tracking-[-0.04em] text-[var(--ink)] md:text-7xl">
          Reach out.
        </h1>
        <p className="mt-4 max-w-[58ch] text-base leading-8 text-[var(--muted-ink)]">
          Questions about our work, research or collaboration? We’d be glad to
          hear from you.
        </p>
      </header>

      <div className="contact-layout mt-10 md:mt-14">
        <section className="contact-info" aria-labelledby="contact-info-title">
          <div>
            <h2
              id="contact-info-title"
              className="font-commissioner text-2xl font-bold text-[var(--ink)]"
            >
              Contact information
            </h2>
          </div>

          <div className="mt-6 space-y-1">
            {CONTACTS.map((contact) => {
              const Icon = contact.icon;
              return (
                <a
                  className="contact-info__item"
                  href={contact.href}
                  key={contact.label}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-[var(--signal-accent)]" />
                  <span>
                    <span className="contact-info__label">{contact.label}</span>
                    <span className="contact-info__value">{contact.value}</span>
                  </span>
                  <IconArrowUpRight className="ml-auto mt-1 h-4 w-4 shrink-0 text-[var(--muted-ink)]" />
                </a>
              );
            })}
          </div>

          <div className="contact-info__socials">
            <span className="contact-info__label">FOLLOW THE TEAM</span>
            <a
              href="https://www.linkedin.com/company/rugved-systems/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <IconArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.instagram.com/rugved_systems"
              target="_blank"
              rel="noreferrer"
            >
              Instagram <IconArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a href="https://rugved.co.in/" target="_blank" rel="noreferrer">
              Official site <IconArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <p className="contact-info__source">
            The team email is listed in{" "}
            <a
              href="https://www.manipal.edu/content/dam/manipal/mu/mit/images/ad_sw/Ingenuity2022.pdf"
              target="_blank"
              rel="noreferrer"
            >
              MAHE’s 2022 Ingenuity compendium
            </a>
            .
          </p>
        </section>

        <section className="contact-form-panel" aria-labelledby="contact-form-title">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--field-accent)]">
                SEND A NOTE
              </span>
              <h2
                id="contact-form-title"
                className="mt-3 font-commissioner text-2xl font-bold text-[var(--ink)]"
              >
                Email form
              </h2>
            </div>
            <span className="contact-form-panel__status">EMAIL DRAFT</span>
          </div>

          <form
            className="contact-form mt-7"
            onSubmit={handleSubmit}
            aria-describedby="contact-form-note"
          >
            <div className="contact-form__row">
              <label>
                <span>Your name</span>
                <input name="name" autoComplete="name" placeholder="Name" required />
              </label>
              <label>
                <span>Your email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
            </div>
            <label>
              <span>Subject</span>
              <input name="subject" placeholder="What would you like to discuss?" />
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" rows={5} placeholder="Write your message" required />
            </label>
            <button type="submit">Compose email</button>
            <p id="contact-form-note" className="contact-form__note">
              This opens your email app with the message pre-filled, addressed to
              the team. Nothing is stored on this site.
            </p>
          </form>
        </section>
      </div>

      <div className="contact-bottom-link">
        <span>Prefer to explore first?</span>
        <Link href="/projects">
          View the platforms
          <IconArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
