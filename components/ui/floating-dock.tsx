"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

export interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

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
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-3 flex flex-col items-center gap-2.5"
          >
            {items.map((item, idx) => {
              const isExternal = item.href.startsWith("http");
              const content = (
                <div
                  className="floating-dock-item flex h-11 w-11 items-center justify-center rounded-full border border-[#c2b8a3]/20 bg-[#111410]/90 text-[#c2b8a3] shadow-lg backdrop-blur-xl transition-all hover:border-[#c2b8a3]/40"
                >
                  <div className="h-5 w-5">{item.icon}</div>
                </div>
              );

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    transition: { delay: idx * 0.04 },
                  }}
                  transition={{ delay: (items.length - 1 - idx) * 0.04 }}
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
                    >
                      {content}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle tactical dock navigation"
        className="floating-dock flex h-12 w-12 items-center justify-center rounded-full border border-[#c2b8a3]/25 bg-[#111410]/45 text-[#c2b8a3] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-emerald-500/50"
      >
        <IconLayoutNavbarCollapse className="h-5 w-5" />
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
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "floating-dock mx-auto hidden h-16 items-end gap-3 rounded-full border border-[#c2b8a3]/25 bg-[#0c100c]/45 px-4 pb-3 shadow-[0_12px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl md:flex",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isExternal = href.startsWith("http");

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 68, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 68, 40]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [18, 30, 18]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [18, 30, 18]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const innerElement = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="floating-dock-item relative flex aspect-square items-center justify-center rounded-full border border-[#c2b8a3]/15 bg-black/50 text-[#c2b8a3] transition-colors backdrop-blur-md hover:border-[#c2b8a3]/40 hover:bg-black/70"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-9 left-1/2 w-fit rounded-md border border-[#c2b8a3]/20 bg-[#111410] px-2.5 py-1 font-mono text-[10px] tracking-wider whitespace-pre text-[#e8e6dc] shadow-md pointer-events-none"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className="flex items-center justify-center"
      >
        {icon}
      </motion.div>


    </motion.div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={title}>
        {innerElement}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={title}>
      {innerElement}
    </Link>
  );
}

export default FloatingDock;
