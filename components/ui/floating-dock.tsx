"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";

export interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}

const DOCK_BASE_SIZE = 40;
const DOCK_MAX_SIZE = 64;
const DOCK_BASE_ICON = 18;
const DOCK_MAX_ICON = 28;
const DOCK_FALLOFF = 150;

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: DockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative block md:hidden", className)}>
      {open && (
        <div className="floating-dock-menu absolute right-0 bottom-full mb-3 flex flex-col items-end gap-2.5">
          {items.map((item, idx) => {
            const isExternal = item.href.startsWith("http");
            const content = (
              <div
                className={
                  "floating-dock-item flex h-11 w-11 items-center justify-center rounded-full" +
                  (item.active ? " is-active" : "")
                }
              >
                <div className="h-5 w-5">{item.icon}</div>
              </div>
            );

            return (
              <div
                key={item.title}
                style={{ "--i": items.length - 1 - idx } as React.CSSProperties}
              >
                {isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    aria-label={item.title}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-label={item.title}
                    aria-current={item.active ? "page" : undefined}
                  >
                    {content}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close quick navigation" : "Open quick navigation"}
        aria-expanded={open}
        className="floating-dock floating-dock__fab flex h-12 w-12 items-center justify-center rounded-full"
      >
        <IconLayoutNavbarCollapse className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) => {
  const dockRef = useRef<HTMLDivElement>(null);
  const pointerX = useRef<number | null>(null);
  const frame = useRef(0);

  const updateMagnification = useCallback(() => {
    frame.current = 0;
    const dock = dockRef.current;
    if (!dock) return;

    const activeX = pointerX.current;
    const controls = dock.querySelectorAll<HTMLElement>("[data-dock-magnify]");

    controls.forEach((control) => {
      if (activeX === null) {
        control.style.setProperty("--dock-size", `${DOCK_BASE_SIZE}px`);
        control.style.setProperty("--dock-icon-size", `${DOCK_BASE_ICON}px`);
        return;
      }

      const bounds = control.getBoundingClientRect();
      const distance = Math.abs(activeX - (bounds.x + bounds.width / 2));
      const influence = Math.max(0, 1 - distance / DOCK_FALLOFF);
      const size = DOCK_BASE_SIZE + (DOCK_MAX_SIZE - DOCK_BASE_SIZE) * influence;
      const iconSize =
        DOCK_BASE_ICON + (DOCK_MAX_ICON - DOCK_BASE_ICON) * influence;

      control.style.setProperty("--dock-size", `${size.toFixed(2)}px`);
      control.style.setProperty("--dock-icon-size", `${iconSize.toFixed(2)}px`);
    });
  }, []);

  const scheduleMagnification = useCallback(() => {
    if (!frame.current) {
      frame.current = window.requestAnimationFrame(updateMagnification);
    }
  }, [updateMagnification]);

  useEffect(() => {
    return () => {
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerX.current = event.clientX;
    scheduleMagnification();
  };

  const handlePointerLeave = () => {
    pointerX.current = null;
    scheduleMagnification();
  };

  return (
    <div
      ref={dockRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "floating-dock mx-auto hidden h-16 items-end gap-2.5 rounded-full px-3.5 pb-3 md:flex",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer key={item.title} {...item} />
      ))}
    </div>
  );
};

function IconContainer({
  title,
  icon,
  href,
  active,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}) {
  const isExternal = href.startsWith("http");

  const innerElement = (
    <div
      data-dock-magnify
      className={
        "floating-dock-item relative flex aspect-square items-center justify-center rounded-full" +
        (active ? " is-active" : "")
      }
    >
      <div
        aria-hidden="true"
        className="floating-dock-tooltip pointer-events-none absolute -top-9 left-1/2 w-fit whitespace-pre rounded-md px-2.5 py-1"
      >
        {title}
      </div>

      <div className="floating-dock-item__icon flex items-center justify-center">
        {icon}
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={title}
        className="floating-dock__link"
      >
        {innerElement}
      </a>
    );
  }

  return (
    <Link
      href={href}
      aria-label={title}
      aria-current={active ? "page" : undefined}
      className="floating-dock__link"
    >
      {innerElement}
    </Link>
  );
}

export default FloatingDock;
