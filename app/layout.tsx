import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { ThemeProvider } from "@/components/theme-provider";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RUGVED Systems — MIT Manipal | Defence Robotics",
  description: "R.U.G.V.E.D Systems — Remote Unmanned Ground Vehicular Electronic Defence. Student defence robotics at MIT Manipal (Est. 2016). WALRUS UGV, AI navigation, field robotics.",
};

type Theme = "dark" | "light";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const savedTheme = (await cookies()).get("rugved-theme")?.value;
  const initialTheme: Theme | null =
    savedTheme === "dark" || savedTheme === "light" ? savedTheme : null;
  const renderedTheme = initialTheme ?? "dark";

  return (
    <html
      lang="en"
      className={openSans.variable + " h-full antialiased " + renderedTheme}
      data-theme={renderedTheme}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--page)]">
        <ThemeProvider initialTheme={initialTheme}>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}