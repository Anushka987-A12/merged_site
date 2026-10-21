import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RUGVED Systems — MIT Manipal | Defence Robotics",
  description: "R.U.G.V.E.D Systems — Remote Unmanned Ground Vehicular Electronic Defence. Student defence robotics at MIT Manipal (Est. 2016). WALRUS UGV, AI navigation, field robotics.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={openSans.variable + " h-full antialiased dark"}
      data-theme="dark"
    >
      <body className="min-h-full flex flex-col bg-[var(--page)]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
