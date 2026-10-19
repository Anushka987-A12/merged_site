"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
type ThemeCtx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const Ctx = createContext<ThemeCtx>({ theme: "dark", toggle: () => {}, setTheme: () => {} });

export function useTheme() {
  return useContext(Ctx);
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: Theme | null;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme ?? "dark");
  const [ready, setReady] = useState(initialTheme !== null);

  useEffect(() => {
    if (initialTheme !== null) {
      setReady(true);
      return;
    }

    let storedTheme: Theme | null = null;
    try {
      const stored = localStorage.getItem("rugved-theme");
      if (stored === "dark" || stored === "light") storedTheme = stored;
    } catch {
      // The system preference below remains available when storage is restricted.
    }

    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
    setTheme(storedTheme ?? (prefersLight ? "light" : "dark"));
    setReady(true);
  }, [initialTheme]);

  useEffect(() => {
    if (!ready) return;

    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
    document.cookie = "rugved-theme=" + theme + "; Path=/; Max-Age=31536000; SameSite=Lax";

    try {
      localStorage.setItem("rugved-theme", theme);
    } catch {
      // Theme changes still apply for this session when storage is unavailable.
    }
  }, [theme, ready]);

  const toggle = () =>
    setTheme((current) => (current === "dark" ? "light" : "dark"));

  return <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>;
}