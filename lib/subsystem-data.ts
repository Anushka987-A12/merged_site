export type SubsystemIcon = "management" | "robotics" | "electronics" | "mechanical" | "research";

export type Subsystem = {
  slug: string;
  code: string;
  title: string;
  category: string;
  icon: SubsystemIcon;
  leadRole: string;
  summary: string;
  overview: string;
  deliverables: string[];
  focus: string[];
};

export const SUBSYSTEMS: Subsystem[] = [
  {
    slug: "management",
    code: "S-01",
    title: "Management",
    category: "OPERATIONS & LOGISTICS",
    icon: "management",
    leadRole: "Operations, partnerships & PR leads",
    summary: "Keeps the project organised across schedules, resources, division coordination and outreach.",
    overview: "The Management division keeps the project on schedule and resourced properly. It maintains milestones, coordinates work between divisions, manages budgets and materials, and reports progress so leadership can make decisions with current information.",
    deliverables: ["Annual strategic roadmap", "System architecture specifications", "Sponsor proposals and budget audits", "Outreach and event coordination"],
    focus: ["Project tracking", "Resource allocation", "Cross-division coordination", "Sponsor relations"],
  },
  {
    slug: "ai-robotics",
    code: "S-02",
    title: "AI & Robotics",
    category: "SOFTWARE & AUTONOMY",
    icon: "robotics",
    leadRole: "Autonomy & computer vision leads",
    summary: "Turns sensor data into navigation, perception and coordinated robotic behaviour.",
    overview: "The AI & Robotics division develops the software that lets platforms perceive their surroundings and act on their own. From sensor fusion and path planning to swarm coordination, this team turns hardware signals into useful decisions.",
    deliverables: ["ROS 2 autonomy stack", "3D SLAM and LiDAR perception", "PyTorch edge-AI and vision models", "UAV coordination logic"],
    focus: ["Autonomous navigation", "Perception and vision", "Swarm coordination", "Behaviour and planning"],
  },
  {
    slug: "electronics",
    code: "S-03",
    title: "Electronics",
    category: "HARDWARE & EMBEDDED",
    icon: "electronics",
    leadRole: "Electronics head & firmware engineers",
    summary: "Builds the sensing, control, power and communication hardware behind each platform.",
    overview: "The Electronics division designs and builds the hardware that every other subsystem depends on. This includes sensor selection and wiring, microcontroller board design, power distribution and the integration work that brings separate modules together into one reliable system.",
    deliverables: ["Custom motor drivers and sensor telemetry", "FPGA signal-processing boards", "Redundant battery-management modules", "Embedded firmware and power distribution"],
    focus: ["Sensor integration", "Microcontroller systems", "Circuit design", "Radar and RF"],
  },
  {
    slug: "mechanical",
    code: "S-04",
    title: "Mechanical",
    category: "ENGINEERING & CHASSIS",
    icon: "mechanical",
    leadRole: "Mechanical lead & CAD specialists",
    summary: "Designs field-ready chassis, mobility systems and modular payload structures.",
    overview: "The Mechanical division builds the chassis and structures that everything else mounts to. It covers vehicle design, suspension and drivetrain choices, payload integration, and the material and manufacturing decisions that determine how well the platform survives field conditions.",
    deliverables: ["All-terrain track assembly", "Armored chassis and modular payload bays", "SolidWorks CAD and FEA stress models", "Structural testing and fabrication"],
    focus: ["Chassis design", "Drivetrain and mobility", "Payload integration", "Materials and durability"],
  },
  {
    slug: "ai-research",
    code: "S-05",
    title: "AI Research",
    category: "SCIENCE & INNOVATION",
    icon: "research",
    leadRole: "Research director & paper authors",
    summary: "Evaluates sensing and perception methods, documents results and informs engineering decisions.",
    overview: "The AI Research division handles the thinking behind the build. It studies sensing technologies, evaluates algorithms and documents findings so the rest of the team can make informed choices based on evidence.",
    deliverables: ["Peer-reviewed papers and technical reports", "Simulation and algorithm benchmarks", "Sensor data analysis", "Patent and IP documentation"],
    focus: ["Applied research", "Algorithm evaluation", "Data analysis", "Documentation"],
  },
];

export function getSubsystem(slug: string) {
  return SUBSYSTEMS.find((subsystem) => subsystem.slug === slug);
}
