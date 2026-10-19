"use client";
import React, { useState, useRef, useEffect } from "react";
import { IconTerminal, IconCornerDownLeft, IconTrash } from "@tabler/icons-react";

interface TerminalLine {
  id: string;
  type: "input" | "output" | "system" | "error";
  text: string;
}

const INITIAL_LINES: TerminalLine[] = [
  { id: "1", type: "system", text: "RUGVED TACTICAL TELEMETRY CONSOLE [v4.18-PROD]" },
  { id: "2", type: "system", text: "Node: mit-manipal.rvd.local · secure enclave active" },
  { id: "3", type: "system", text: "Type 'help' or click quick queries below to inspect system diagnostics." },
];

const PRESET_COMMANDS = [
  { cmd: "help", label: "help" },
  { cmd: "status", label: "sys --health" },
  { cmd: "walrus", label: "walrus --specs" },
  { cmd: "subsystems", label: "divisions" },
  { cmd: "papers", label: "research" },
  { cmd: "clear", label: "clear" },
];

export const InteractiveTerminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>(INITIAL_LINES);
  const [inputVal, setInputVal] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lineIdRef = useRef(100);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim().toLowerCase();
    if (!trimmed) return;

    const nextId = () => String(++lineIdRef.current);
    const newLines: TerminalLine[] = [
      ...lines,
      { id: nextId(), type: "input", text: rawCmd },
    ];

    switch (trimmed) {
      case "help":
        newLines.push({
          id: nextId(),
          type: "output",
          text: `AVAILABLE COMMANDS:\n  • status      — Run live system diagnostics & node health\n  • walrus      — Print WALRUS 2.0 UGV platform architectural specifications\n  • subsystems  — Query active engineering divisions (TB, MG, EL, RD, AR, ME)\n  • papers      — List IEEE, ICRA & peer-reviewed research publications\n  • coordinates — Get Manipal Base station GPS coordinates\n  • clear       — Clear terminal buffer`,
        });
        break;

      case "status":
      case "sys --health":
        newLines.push({
          id: nextId(),
          type: "output",
          text: `SYSTEM DIAGNOSTICS · ALL SYSTEMS NOMINAL\n  [OK] NVIDIA Jetson AGX Orin — Core temp 44.2°C | 275 TOPS active\n  [OK] ROS2 Humble node cluster — 18 nodes running (0 errors, 0 dropped frames)\n  [OK] Solid-state LiDAR 360° — Stream stable at 1.2M points/sec\n  [OK] FPGA acoustic array — Microsecond triangulation active\n  [OK] CAN bus telemetry — 1.2ms latency, no packet loss\n  [OK] Power reserve — 48V LiFePO4 at 94% charge (5.8h remaining)`,
        });
        break;

      case "walrus":
      case "walrus --specs":
        newLines.push({
          id: nextId(),
          type: "output",
          text: `PLATFORM: WALRUS 2.0 UGV (Remote Unmanned Ground Vehicular Electronic Defence)\n  • Class: Military-Grade Tactical Field Robotics Platform\n  • Autonomy: Level 4 Autonomous Off-Road Terrain Mapping & Pathfinding\n  • Drivetrain: High-Torque Dual Rubber-Composite Track Assembly\n  • Speed: 22 km/h Max Off-Road | Slope Clearance: 45° Gradient\n  • Payload: 45 kg Modular Quick-Swap (EOD Arm, GPR Mine Array, Drone Scout)\n  • Deployment: Featured at National Defence Expo 2025`,
        });
        break;

      case "subsystems":
      case "divisions":
        newLines.push({
          id: nextId(),
          type: "output",
          text: `ACTIVE SUBSYSTEMS [6 DIVISIONS]:\n  [S-01] THE BOARD (TB)      — Strategic directive & operations leadership\n  [S-02] MANAGEMENT (MG)     — Timeline control, logistics & sponsor relations\n  [S-03] ELECTRONICS (EL)    — High-speed PCB design, power distribution & sensors\n  [S-04] RESEARCH (RD)       — Algorithm exploration, grant proposals & patents\n  [S-05] AI & ROBOTICS (AR)  — ROS2, SLAM, reinforcement learning & CV models\n  [S-06] MECHANICAL (ME)     — Chassis CAD, FEA stress analysis & CNC fabrication`,
        });
        break;

      case "papers":
      case "research":
        newLines.push({
          id: nextId(),
          type: "output",
          text: `PEER-REVIEWED PUBLICATIONS & PATENTS:\n  [1] Autonomous Terrain Navigation Using Deep AI — IEEE, 2024\n  [2] Optimized Pathfinding in Field UGV Systems — ICRA, 2023\n  [3] Reinforcement Learning for Obstacle Avoidance — Elsevier Robotics Journal\n  [4] AI Terrain Navigation Sensor Architecture — Patent Filed (2024)`,
        });
        break;

      case "coordinates":
        newLines.push({
          id: nextId(),
          type: "output",
          text: `BASE STATION LOCATION:\n  Manipal Institute of Technology, Karnataka, India\n  Coordinates: 13.347° N, 74.792° E | Elevation: 73m MSL`,
        });
        break;

      case "clear":
        setLines(INITIAL_LINES);
        setInputVal("");
        return;

      default:
        newLines.push({
          id: nextId(),
          type: "error",
          text: `rvd-sh: command not recognized: '${rawCmd}'. Type 'help' for available commands.`,
        });
        break;
    }

    setLines(newLines);
    setInputVal("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(inputVal);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#c2b8a3]/15 bg-[#090c09]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-[#c2b8a3]/12 bg-[#121612] px-5 py-3">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-[#c2b8a3]">
          <IconTerminal className="h-4 w-4 text-emerald-400" />
          <span className="font-bold text-[#e8e6dc]">RUGVED CONSOLE</span>
          <span className="text-[#8b8f6b]">Terminal simulation</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLines(INITIAL_LINES)}
            title="Clear buffer"
            className="flex items-center gap-1 rounded border border-[#c2b8a3]/15 px-2 py-0.5 font-mono text-[10px] text-[#8b8f6b] hover:border-[#c2b8a3]/30 hover:text-[#c2b8a3]"
          >
            <IconTrash className="h-3 w-3" /> CLEAR
          </button>
          <div className="flex items-center gap-1.5 pl-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="font-mono text-[9px] text-emerald-400 font-bold">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Quick Action Command Chips */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#c2b8a3]/10 bg-[#0d100d] px-5 py-2">
        <span className="font-mono text-[10px] tracking-wider text-[#8b8f6b] mr-1">QUICK QUERY:</span>
        {PRESET_COMMANDS.map((p) => (
          <button
            key={p.cmd}
            onClick={() => handleCommand(p.cmd)}
            className="rounded border border-[#c2b8a3]/15 bg-black/40 px-2.5 py-0.5 font-mono text-[10px] text-[#c2b8a3] hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
          >
            ${p.label}
          </button>
        ))}
      </div>

      {/* Scrollable Terminal Output Body */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="h-64 overflow-y-auto p-5 font-mono text-[12px] leading-relaxed select-text cursor-text space-y-2.5"
      >
        {lines.map((l) => (
          <div key={l.id}>
            {l.type === "input" && (
              <div className="flex items-center gap-2 text-[#e8e6dc]">
                <span className="text-emerald-400 font-bold">rvd@mit:~$</span>
                <span>{l.text}</span>
              </div>
            )}
            {l.type === "system" && (
              <div className="text-[#8b8f6b] tracking-wide">{l.text}</div>
            )}
            {l.type === "output" && (
              <pre className="whitespace-pre-wrap font-mono text-[#c2b8a3] pl-2 border-l border-emerald-500/30">
                {l.text}
              </pre>
            )}
            {l.type === "error" && (
              <div className="text-rose-400 font-semibold">{l.text}</div>
            )}
          </div>
        ))}
      </div>

      {/* Terminal Input Line */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-[#c2b8a3]/12 bg-[#0b0e0b] px-5 py-3 font-mono text-[12px]"
      >
        <span className="text-emerald-400 font-bold">rvd@mit:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="type a command (e.g. status, walrus, help)..."
          className="flex-1 bg-transparent text-[#e8e6dc] placeholder:text-[#8b8f6b]/50 focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-6 w-6 items-center justify-center rounded border border-[#c2b8a3]/20 bg-[#141813] text-[#c2b8a3] hover:border-emerald-500 hover:text-emerald-300"
          title="Execute command"
        >
          <IconCornerDownLeft className="h-3 w-3" />
        </button>
      </form>
    </div>
  );
};

export default InteractiveTerminal;
