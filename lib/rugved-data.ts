import { PROJECTS } from "@/lib/project-data";
import { PATENTS, RESEARCH, RESEARCH_DISCLOSURE, PATENT_DISCLOSURE } from "@/lib/research-data";

const STATIC_PROJECT_DETAILS = {
  walrus: {
    legacyTitle: "Unmanned Ground Vehicle",
    legacySummary:
      "An autonomous, modular ground vehicle exploring all-terrain mobility and payload integration.",
    legacyDetail:
      "WALRUS brings together a modular tracked platform, autonomous navigation, mapping and sensing research for field robotics.",
    legacyImage: "/pictures/ugv.png",
  },
  drone: {
    legacyTitle: "UAV Swarm",
    legacySummary:
      "An autonomous aerial system designed around coordinated sensing and mission hand-offs.",
    legacyDetail:
      "The swarm project investigates how multiple UAVs can coordinate navigation, sensing and task hand-offs during a shared mission.",
    legacyImage: "/pictures/swarm.png",
  },
} as const;

const MILESTONES = [
  { id: 1, year: "2017", type: "achievement", badge: "UAV CHALLENGE", title: "Tata Pioneer’s Makerthon", detail: "National-level winner · Techfest, IIT Bombay", tag: "FIRST COMPETITION" },
  { id: 2, year: "2018", type: "achievement", badge: "IGVC", title: "Design Challenge", detail: "8th worldwide · Intelligent Ground Vehicle Competition", tag: "INTERNATIONAL" },
  { id: 3, year: "2020", type: "achievement", badge: "COVIDEATE", title: "Covideate", detail: "First place · IIT Bombay Techfest", tag: "TECHFEST" },
  { id: 4, year: "2020", type: "achievement", badge: "E-YANTRA", title: "e-Yantra Robotics Competition", detail: "Finalist · e-Yantra Robotics Competition (EYRC)", tag: "ROBOTICS" },
  { id: 5, year: "2020", type: "achievement", badge: "FORD GME", title: "Ford GME Hackathon", detail: "Second place", tag: "HACKATHON" },
  { id: 6, year: "2020", type: "achievement", badge: "DEF HACKS", title: "Def Hacks Global 2.0", detail: "First place · Major League Hacking", tag: "GLOBAL" },
  { id: 7, year: "2021", type: "achievement", badge: "PRAGYAAN", title: "Pragyaan Fusion Hackathon", detail: "First place · Mechanical and Electrical divisions · NIT Trichy", tag: "NIT TRICHY" },
  { id: 8, year: "2023", type: "achievement", badge: "GUIDING GAZE", title: "OpenCV AI Competition", detail: "International Rank 7 · Only Indian undergraduate team", tag: "COMPUTER VISION" },
  { id: 9, year: "2023–24", type: "achievement", badge: "E-YANTRA", title: "IIT Bombay Robotics Competition", detail: "All India Rank 10", tag: "ROBOTICS" },
  { id: 10, year: "2024", type: "achievement", badge: "SMART INDIA HACKATHON", title: "National finalist", detail: "Top 5 · Defence theme", tag: "AI TERRAIN NAVIGATION" },
  { id: 11, year: "2025", type: "achievement", badge: "AYUSH HABBA", title: "Ayush Habba Hackathon", detail: "First place · ₹25,000 prize · Mangalore", tag: "HACKATHON" },
  { id: 12, year: "2025", type: "achievement", badge: "E-YANTRA", title: "e-Yantra Stage 2", detail: "Among the top 20 teams in India to reach Stage 2", tag: "ROBOTICS" },
  { id: 13, year: "2025", type: "achievement", badge: "WALRUS 2.0", title: "National Defence Expo", detail: "Prototype feature and platform showcase", tag: "FIELD ROBOTICS" },
  { id: 14, year: "2026", type: "achievement", badge: "TECHSOLSTICE", title: "TechSolstice competitions", detail: "Top 7 and Top 15 finishes · MITB competitions", tag: "COMPETITION RESULTS" },
];

export const RUGVED_DATA = {
  projects: PROJECTS.map((project) => ({
    ...project,
    ...STATIC_PROJECT_DETAILS[project.slug as keyof typeof STATIC_PROJECT_DETAILS],
  })),
  research: RESEARCH,
  patents: PATENTS,
  disclosures: {
    research: RESEARCH_DISCLOSURE,
    patents: PATENT_DISCLOSURE,
  },
  milestones: MILESTONES,
} as const;

export type RugvedMilestone = (typeof RUGVED_DATA.milestones)[number];
