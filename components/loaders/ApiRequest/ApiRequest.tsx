"use client";

import React, { useEffect, useState } from "react";
import styles from "./ApiRequest.module.css";

export interface ApiRequestProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  size?: number | string;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  color?: string;
}

export const ApiRequest: React.FC<ApiRequestProps> = ({
  progress: customProgress,
  size = 160,
  speed = "normal",
  interactive = true,
  onProgressChange,
  color = "#0ea5e9",
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

  const handleReset = () => {
    if (!interactive) return;
    if (customProgress === undefined) {
      setInternalProgress(0);
    }
    onProgressChange?.(0);
  };

  const width = typeof size === "number" ? `${size * 1.8}px` : size;
  const height = typeof size === "number" ? `${size * 0.8}px` : "120px";

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
          "--packet-color": color,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className={styles.server}>
        <span />
        <span />
        <span />
      </div>
      <div className={styles.packets}>
        <span className={styles.packet} />
        <span className={`${styles.packet} ${styles.packetDelay}`} />
        <span className={`${styles.packet} ${styles.packetDelay2}`} />
      </div>
      <div className={styles.link}>
        <div className={styles.linkFill} style={{ width: `${activeProgress}%` }} />
      </div>
      <div className={styles.server}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default ApiRequest;
