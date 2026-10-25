import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "RUGVED Systems — MIT Manipal | Defence Robotics",
  description: "R.U.G.V.E.D Systems — Remote Unmanned Ground Vehicular Electronic Defence. Student defence robotics at MIT Manipal (Est. 2016). WALRUS UGV, AI navigation, field robotics.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      data-theme="dark"
    >
      <body className="min-h-full flex flex-col bg-[var(--page)]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
