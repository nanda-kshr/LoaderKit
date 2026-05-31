"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./SwordForging.module.css";

export interface SwordForgingProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  size?: number | string;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  accentColor?: string;
}

const stageLabels = ["Heating", "Hammering", "Cooling", "Polishing"] as const;

type ForgeStage = "heating" | "hammering" | "cooling" | "polishing";

export const SwordForging: React.FC<SwordForgingProps> = ({
  progress: customProgress,
  size = 150,
  speed = "normal",
  interactive = true,
  onProgressChange,
  accentColor = "#f97316",
  className = "",
  style,
  ...props
}) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const activeProgress = customProgress !== undefined ? customProgress : internalProgress;

  useEffect(() => {
    if (customProgress !== undefined) return;

    let step = 0.9;
    let intervalTime = 50;

    if (speed === "slow") {
      step = 0.45;
      intervalTime = 70;
    } else if (speed === "fast") {
      step = 1.8;
      intervalTime = 30;
    }

    const interval = setInterval(() => {
      setInternalProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          onProgressChange?.(0);
          return 0;
        }
        onProgressChange?.(Math.round(next));
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [customProgress, speed, onProgressChange]);

  const stage = useMemo<ForgeStage>(() => {
    if (activeProgress < 25) return "heating";
    if (activeProgress < 50) return "hammering";
    if (activeProgress < 75) return "cooling";
    return "polishing";
  }, [activeProgress]);

  const stageLabel = stageLabels[Math.min(3, Math.floor(activeProgress / 25))];

  const handleReset = () => {
    if (!interactive) return;
    if (customProgress === undefined) {
      setInternalProgress(0);
    }
    onProgressChange?.(0);
  };

  const width = typeof size === "number" ? `${size * 1.5}px` : size;
  const height = typeof size === "number" ? `${size * 0.6}px` : "90px";

  return (
    <div
      className={`${styles.container} ${styles[stage]} ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(activeProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      onClick={handleReset}
      style={
        {
          width,
          height,
          "--forge-accent": accentColor,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <svg className={styles.forgeSvg} viewBox="0 0 240 120" aria-hidden="true">
        <defs>
          <linearGradient id="blade-glow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#cbd5f5" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
        </defs>

        <path
          className={styles.anvil}
          d="M26 84 L78 84 L94 70 L148 70 L162 84 L212 84 L212 96 L26 96 Z"
        />
        <rect className={styles.anvilBase} x="40" y="96" width="160" height="14" rx="4" />

        <g className={styles.sword}>
          <path className={styles.blade} d="M68 64 L172 64 L182 60 L172 56 L68 56 Z" fill="url(#blade-glow)" />
          <rect className={styles.guard} x="58" y="52" width="12" height="16" rx="2" />
          <rect className={styles.handle} x="48" y="54" width="10" height="12" rx="2" />
          <circle className={styles.pommel} cx="45" cy="60" r="4" />
        </g>

        <g className={styles.hammer}>
          <rect x="182" y="28" width="26" height="10" rx="2" />
          <rect x="170" y="32" width="12" height="6" rx="2" />
          <rect className={styles.hammerHandle} x="196" y="34" width="4" height="30" rx="2" />
        </g>

        <g className={styles.sparks}>
          <circle cx="150" cy="50" r="3" />
          <circle cx="160" cy="44" r="2" />
          <circle cx="168" cy="54" r="2.5" />
        </g>
      </svg>
      <div className={styles.status}>
        <span>{stageLabel}</span>
        <span>{Math.round(activeProgress)}%</span>
      </div>
    </div>
  );
};

export default SwordForging;
