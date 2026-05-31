"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./DependencyGraph.module.css";

export interface DependencyGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  size?: number | string;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  color?: string;
}

const NODES = [
  { id: "app", x: 30, y: 60 },
  { id: "ui", x: 80, y: 25 },
  { id: "api", x: 140, y: 40 },
  { id: "db", x: 190, y: 70 },
  { id: "auth", x: 90, y: 95 },
  { id: "cache", x: 150, y: 95 },
];

const EDGES = [
  [0, 1],
  [1, 2],
  [0, 4],
  [4, 5],
  [2, 5],
  [2, 3],
];

export const DependencyGraph: React.FC<DependencyGraphProps> = ({
  progress: customProgress,
  size = 160,
  speed = "normal",
  interactive = true,
  onProgressChange,
  color = "#38bdf8",
  className = "",
  style,
  ...props
}) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const activeProgress = customProgress !== undefined ? customProgress : internalProgress;

  useEffect(() => {
    if (customProgress !== undefined) return;

    let step = 1;
    let intervalTime = 60;

    if (speed === "slow") {
      step = 0.5;
      intervalTime = 80;
    } else if (speed === "fast") {
      step = 1.8;
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

  const totalItems = EDGES.length + NODES.length;
  const visibleCount = useMemo(() => {
    return Math.min(totalItems, Math.floor((activeProgress / 100) * totalItems));
  }, [activeProgress, totalItems]);

  const width = typeof size === "number" ? `${size * 1.6}px` : size;
  const height = typeof size === "number" ? `${size}px` : "140px";

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
          "--graph-color": color,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <svg className={styles.graphSvg} viewBox="0 0 220 120" aria-hidden="true">
        {EDGES.map(([from, to], index) => {
          const start = NODES[from];
          const end = NODES[to];
          const isVisible = index < visibleCount;
          return (
            <line
              key={`edge-${from}-${to}`}
              className={isVisible ? styles.edgeActive : styles.edge}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
            />
          );
        })}
        {NODES.map((node, index) => {
          const idx = EDGES.length + index;
          const isVisible = idx < visibleCount;
          return (
            <g key={node.id} className={isVisible ? styles.nodeActive : styles.node}>
              <circle cx={node.x} cy={node.y} r={10} />
              <circle cx={node.x} cy={node.y} r={4} className={styles.nodeCore} />
            </g>
          );
        })}
      </svg>
      <div className={styles.caption}>dependency graph</div>
    </div>
  );
};

export default DependencyGraph;
