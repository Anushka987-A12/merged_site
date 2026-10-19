import type { Capability } from "@/lib/project-data";

export function CapabilityAnimation({
  kind,
  label,
}: {
  kind: Capability["animation"];
  label: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={"capability-bit capability-bit--" + kind}
    >
      <div className="capability-bit__frame">
        <span className="capability-bit__label">{label}</span>
        <div className="capability-bit__screen">
          {kind === "terrain" && (
            <>
              <span className="terrain-map terrain-map--back" />
              <span className="terrain-map terrain-map--front" />
              <span className="terrain-sweep" />
              <span className="terrain-target" />
            </>
          )}
          {kind === "modular" && (
            <>
              <span className="module-track" />
              <span className="module-block module-block--one" />
              <span className="module-block module-block--two" />
              <span className="module-block module-block--three" />
            </>
          )}
          {kind === "recon" && (
            <>
              <span className="recon-radar" />
              <span className="recon-sweep" />
              <span className="recon-return recon-return--one" />
              <span className="recon-return recon-return--two" />
            </>
          )}
          {kind === "link" && (
            <>
              <span className="link-node link-node--ground" />
              <span className="link-node link-node--air" />
              <span className="link-pulse link-pulse--one" />
              <span className="link-pulse link-pulse--two" />
              <span className="link-path" />
            </>
          )}
        </div>
        <div className="capability-bit__footer">
          <span>SYS</span>
          <span className="capability-bit__pixels">
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>READY</span>
        </div>
      </div>
    </div>
  );
}
