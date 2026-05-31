"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./GitCommit.module.css";

export interface GitCommitProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  size?: number | string;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  color?: string;
}

const NODE_COUNT = 5;

export const GitCommit: React.FC<GitCommitProps> = ({
  progress: customProgress,
  size = 140,
  speed = "normal",
  interactive = true,
  onProgressChange,
  color = "#22c55e",
  className = "",
  style,
  ...props
}) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const activeProgress = customProgress !== undefined ? customProgress : internalProgress;

  useEffect(() => {
    if (customProgress !== undefined) return;

    let step = 1.2;
    let intervalTime = 60;

    if (speed === "slow") {
      step = 0.6;
      intervalTime = 80;
    } else if (speed === "fast") {
      step = 2.2;
      intervalTime = 40;
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

  const activeIndex = useMemo(() => {
    const idx = Math.floor((activeProgress / 100) * NODE_COUNT);
    return Math.min(NODE_COUNT - 1, Math.max(0, idx));
  }, [activeProgress]);

  const width = typeof size === "number" ? `${size * 1.9}px` : size;
  const height = typeof size === "number" ? `${size * 0.6}px` : "48px";

  const handleReset = () => {
    if (!interactive) return;
    if (customProgress === undefined) {
      setInternalProgress(0);
    }
    onProgressChange?.(0);
  };

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
          width,
          height,
          "--commit-color": color,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <svg className={styles.commitSvg} viewBox="0 0 220 60" aria-hidden="true">
        {Array.from({ length: NODE_COUNT - 1 }).map((_, index) => {
          const x1 = 30 + index * 40;
          const x2 = x1 + 40;
          return (
            <line
              key={`link-${index}`}
              className={index < activeIndex ? styles.linkActive : styles.link}
              x1={x1}
              y1={30}
              x2={x2}
              y2={30}
            />
          );
        })}
        {Array.from({ length: NODE_COUNT }).map((_, index) => {
          const x = 30 + index * 40;
          return (
            <circle
              key={`node-${index}`}
              className={index <= activeIndex ? styles.nodeActive : styles.node}
              cx={x}
              cy={30}
              r={10}
            />
          );
        })}
      </svg>
      <div className={styles.caption}>git commit</div>
    </div>
  );
};

export default GitCommit;
