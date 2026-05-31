"use client";

import React, { useEffect, useState } from "react";
import styles from "./DragonFire.module.css";

export interface DragonFireProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  size?: number | string;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  fireColor?: string;
}

export const DragonFire: React.FC<DragonFireProps> = ({
  progress: customProgress,
  size = 160,
  speed = "normal",
  interactive = true,
  onProgressChange,
  fireColor = "#f97316",
  className = "",
  style,
  ...props
}) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const activeProgress = customProgress !== undefined ? customProgress : internalProgress;

  useEffect(() => {
    if (customProgress !== undefined) return;

    let step = 0.8;
    let intervalTime = 50;

    if (speed === "slow") {
      step = 0.4;
      intervalTime = 70;
    } else if (speed === "fast") {
      step = 1.6;
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

  const handleReset = () => {
    if (!interactive) return;
    if (customProgress === undefined) {
      setInternalProgress(0);
    }
    onProgressChange?.(0);
  };

  const barWidth = typeof size === "number" ? `${size * 1.8}px` : size;
  const barHeight = typeof size === "number" ? `${Math.max(18, size * 0.18)}px` : "20px";

  return (
    <div
      className={`${styles.container} ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(activeProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      onClick={handleReset}
      style={
        {
          width: barWidth,
          "--fire-color": fireColor,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className={styles.header}>
        <svg className={styles.dragonSvg} viewBox="0 0 120 90" aria-hidden="true">
          <defs>
            <linearGradient id="dragon-scale" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4b1f24" />
              <stop offset="100%" stopColor="#2a0e12" />
            </linearGradient>
          </defs>
          <path
            className={styles.dragonHead}
            d="M24 54 C18 42 22 28 36 22 C52 14 70 18 82 30 C96 44 104 44 108 42 C104 52 96 56 90 58 C84 60 78 68 68 74 C54 82 36 78 28 68 C26 64 25 60 24 54 Z"
            fill="url(#dragon-scale)"
          />
          <path
            className={styles.dragonJaw}
            d="M38 60 C52 64 66 62 78 54 L88 58 C76 70 60 76 44 70 Z"
          />
          <path className={styles.dragonHorn} d="M44 18 L52 6 L58 20 Z" />
          <circle className={styles.dragonEye} cx="66" cy="44" r="3" />
          <path className={styles.dragonNostril} d="M84 48 L90 46" />
        </svg>

        <div className={styles.bar} style={{ height: barHeight }}>
          <div className={styles.fill} style={{ width: `${activeProgress}%` }} />
          <svg className={styles.flameSvg} style={{ left: `${activeProgress}%` }} viewBox="0 0 32 32" aria-hidden="true">
            <path
              className={styles.flamePath}
              d="M16 2 C20 8 22 12 20 16 C25 16 28 20 28 24 C28 29 23 31 16 31 C9 31 4 29 4 23 C4 17 9 14 12 12 C14 10 15 8 16 2 Z"
            />
          </svg>
        </div>
      </div>
      <span className={styles.label}>Dragon Fire</span>
    </div>
  );
};

export default DragonFire;
