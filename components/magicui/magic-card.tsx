"use client";

import { motion, useMotionTemplate } from "framer-motion";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  children?: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

function useUniqueId(prefix = "magic-card") {
  const idRef = React.useRef<string>();
  if (!idRef.current) {
    idRef.current = `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }
  return idRef.current;
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#262626",
  gradientOpacity = 0.8,
  gradientFrom = "#f472b6",
  gradientTo = "#7dd3fc",
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [mouse, setMouse] = React.useState({ x: -9999, y: -9999, inside: false });
  const [borderOpacity, setBorderOpacity] = React.useState(0);

  // IDs SVG uniques pour chaque carte
  const uniqueId = useUniqueId();
  const borderId = `${uniqueId}-border`;
  const maskGradientId = `${uniqueId}-mask-gradient`;
  const maskId = `${uniqueId}-mask`;

  // Fade in/out de la bordure
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (mouse.inside) {
      setBorderOpacity(1);
    } else {
      timeout = setTimeout(() => setBorderOpacity(0), 350);
    }
    return () => clearTimeout(timeout);
  }, [mouse.inside]);

  // Pour le suivi de la souris
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMouse({ x, y, inside: true });
  };

  const handleMouseLeave = () => {
    setMouse((prev) => ({ ...prev, inside: false }));
  };

  React.useLayoutEffect(() => {
    if (cardRef.current) {
      const { width, height } = cardRef.current.getBoundingClientRect();
      setSize({ width, height });
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn("group relative rounded-[inherit]", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Bordure SVG avec masque radial centré sur la souris */}
      {size.width > 0 && size.height > 0 && (
        <svg
          width={size.width}
          height={size.height}
          className="absolute inset-0 pointer-events-none z-10"
          style={{ borderRadius: "inherit" }}
        >
          <defs>
            <linearGradient id={borderId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
            <radialGradient id={maskGradientId} r={gradientSize} gradientUnits="userSpaceOnUse"
  cx={mouse.x} cy={mouse.y}>
              <stop offset="70%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id={maskId}>
              <rect
                x="0"
                y="0"
                width={size.width}
                height={size.height}
                fill={`url(#${maskGradientId})`}
              />
            </mask>
          </defs>
          <rect
            x={1.5}
            y={1.5}
            width={size.width - 3}
            height={size.height - 3}
            rx={16}
            ry={16}
            fill="none"
            stroke={`url(#${borderId})`}
            strokeWidth={1}
            mask={`url(#${maskId})`}
            style={{
              filter: mouse.inside ? `(0 0 0px ${gradientFrom})` : "none",
              opacity: borderOpacity,
              transition: "opacity 0.8s cubic-bezier(.4,0,.2,1), filter 0.5s",
            }}
          />
        </svg>
      )}

      {/* Effet radial dynamique sur le fond */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-border duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouse.x}px ${mouse.y}px,
            white, 
            ${gradientTo}, 
            var(--border) 100%
            )
          `,
        }}
      />
      <div className="absolute inset-px rounded-[inherit] bg-background" />
      <motion.div
        className="pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouse.x}px ${mouse.y}px, transparent, transparent 100%)
          `,
          opacity: gradientOpacity,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}





