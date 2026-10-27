import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

const SITE_DESCRIPTION =
  "R.U.G.V.E.D Systems — Remote Unmanned Ground Vehicular Electronic Defence. Student defence robotics at MIT Manipal (Est. 2016). WALRUS UGV, UAV swarm, AI autonomy and field robotics.";

export const metadata: Metadata = {
  metadataBase: new URL("https://rugved.co.in"),
  title: {
    default: "RUGVED Systems — MIT Manipal | Defence Robotics",
    template: "%s | RUGVED Systems",
  },
  description: SITE_DESCRIPTION,
  applicationName: "RUGVED Systems",
  keywords: [
    "RUGVED",
    "MIT Manipal",
    "defence robotics",
    "unmanned ground vehicle",
    "UGV",
    "UAV swarm",
    "autonomous navigation",
    "field robotics",
  ],
  authors: [{ name: "RUGVED Systems, MIT Manipal" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "RUGVED Systems",
    title: "RUGVED Systems — MIT Manipal | Defence Robotics",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/walrus-ugv.jpeg",
        width: 1200,
        height: 630,
        alt: "RUGVED WALRUS tracked unmanned ground vehicle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RUGVED Systems — MIT Manipal | Defence Robotics",
    description: SITE_DESCRIPTION,
    images: ["/walrus-ugv.jpeg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#071720",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
      data-theme="dark"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-[var(--page)]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
