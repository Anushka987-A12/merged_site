import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team & Subsystems",
  description:
    "Meet the student divisions behind RUGVED Systems at MIT Manipal — management, electronics, mechanical, AI research and autonomy.",
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
