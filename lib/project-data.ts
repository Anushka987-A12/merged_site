export type Capability = {
  title: string;
  summary: string;
  animation: "terrain" | "modular" | "recon" | "link";
};

export type Project = {
  slug: string;
  code: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  imageAlt: string;
  summary: string;
  keyPoints: string[];
  capabilities: Capability[];
  sourceLabel: string;
  sourceUrl: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "walrus",
    code: "P-01",
    title: "WALRUS",
    subtitle: "Unmanned ground vehicle (UGV)",
    category: "GROUND PLATFORM",
    image: "/walrus-ugv.jpeg",
    imageAlt: "RUGVED WALRUS tracked ground vehicle with a drone mounted on top",
    summary:
      "The RUGVED brochure describes WALRUS as a modular tracked UGV for defence applications, with all-terrain mobility and roles including reconnaissance, logistics and tactical support.",
    keyPoints: [
      "Modular tracked unmanned ground vehicle",
      "All-terrain tracked mobility",
      "Autonomous navigation and LiDAR-based mapping",
      "Stabilized payload platform",
      "Multi-role support for reconnaissance, logistics and tactical missions",
    ],
    capabilities: [
      {
        title: "All-terrain tracked mobility",
        summary:
          "The brochure describes a tracked ground vehicle designed for mobility across varied terrain.",
        animation: "terrain",
      },
      {
        title: "Modular mission design",
        summary:
          "An adaptable architecture intended to support reconnaissance, logistics and tactical-support roles.",
        animation: "modular",
      },
      {
        title: "Autonomous navigation & LiDAR mapping",
        summary:
          "Autonomous navigation and LiDAR-based mapping are listed among the UGV’s features.",
        animation: "terrain",
      },
      {
        title: "Stabilized payload platform",
        summary:
          "The brochure lists a stabilized payload platform as part of the UGV’s multi-role design.",
        animation: "recon",
      },
    ],
    sourceLabel: "RUGVED Systems",
    sourceUrl: "https://rugved.co.in/",
  },
  {
    slug: "drone",
    code: "P-02",
    title: "UAV SWARM",
    subtitle: "Coordinated unmanned aerial systems",
    category: "AERIAL PLATFORM",
    image: "/aerial-wing.jpeg",
    imageAlt: "RUGVED unmanned aerial vehicle shown as part of a coordinated swarm",
    summary:
      "The RUGVED brochure presents a coordinated UAV swarm for mission objectives including surveillance, with adaptive planning, autonomous navigation and intelligent decision-making.",
    keyPoints: [
      "Adaptive mission planning",
      "Autonomous navigation and obstacle detection",
      "AI-powered surveillance and re-identification (Re-ID)",
      "Target tracking and night vision",
      "Designed for reliable operation in complex environments",
    ],
    capabilities: [
      {
        title: "Adaptive mission planning",
        summary:
          "Adaptive mission planning is listed as a core feature of the coordinated UAV swarm.",
        animation: "modular",
      },
      {
        title: "Autonomous navigation",
        summary:
          "The brochure lists autonomous navigation and obstacle detection for complex environments.",
        animation: "terrain",
      },
      {
        title: "AI surveillance & tracking",
        summary:
          "Listed capabilities include AI-powered surveillance, re-identification, target tracking and night vision.",
        animation: "recon",
      },
    ],
    sourceLabel: "RUGVED Systems",
    sourceUrl: "https://rugved.co.in/",
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}
