"use client";

import React, { useEffect, useState } from "react";
import styles from "./SatelliteSignal.module.css";

export interface SatelliteSignalProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  size?: number | string;
  speed?: "slow" | "normal" | "fast";
  paused?: boolean;
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
}

export const SatelliteSignal: React.FC<SatelliteSignalProps> = ({
  progress: customProgress,
  size = 120,
  speed = "normal",
  paused = false,
  interactive = true,
  onProgressChange,
  className = "",
  style,
  ...props
}) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const activeProgress = customProgress !== undefined ? customProgress : internalProgress;

  // Simulated auto-progress
  useEffect(() => {
    if (customProgress !== undefined || paused) return;

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
          return 0; // loop
        }
        onProgressChange?.(Math.round(next));
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [customProgress, speed, paused, onProgressChange]);

  const handleContainerClick = () => {
    if (!interactive) return;

    if (customProgress === undefined) {
      setInternalProgress((prev) => (prev >= 90 ? 0 : prev + 15));
    }
  };

  const scaleVal = typeof size === "number" ? size / 120 : 1;

  return (
    <div
      className={`${styles.container} ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(activeProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      onClick={handleContainerClick}
      style={{
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size * 1.2}px` : "auto",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
      {...props}
    >
      <div
        className={styles.satelliteWrapper}
        style={{
          transform: `scale(${scaleVal})`,
          transformOrigin: "center bottom",
        }}
      >
        <svg viewBox="0 0 120 140" width="100%" height="100%" className={styles.satelliteSvg}>
          <defs>
            <linearGradient id="satMetal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cfd8dc" />
              <stop offset="100%" stopColor="#78909c" />
            </linearGradient>

            <linearGradient id="satDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#455a64" />
              <stop offset="100%" stopColor="#263238" />
            </linearGradient>

            <filter id="waveGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Glowing telemetry signal waves pulsing outward (scales with active progress) */}
          <g filter="url(#waveGlow)" className={paused ? styles.pausedAnimations : ""}>
            {activeProgress > 15 && (
              <path
                d="M 25 35 A 40 40 0 0 1 95 35"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="4"
                strokeLinecap="round"
                className={styles.signalWave1}
              />
            )}
            {activeProgress > 45 && (
              <path
                d="M 12 25 A 60 60 0 0 1 108 25"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="4"
                strokeLinecap="round"
                className={styles.signalWave2}
              />
            )}
            {activeProgress > 75 && (
              <path
                d="M 0 15 A 80 80 0 0 1 120 15"
                fill="none"
                stroke="#00b0ff"
                strokeWidth="4"
                strokeLinecap="round"
                className={styles.signalWave3}
              />
            )}
          </g>

          {/* Satellite Dish Structure */}
          <g className={paused ? "" : styles.dishBob}>
            {/* Dish Base Tripod / Mount */}
            <path
              d="
                M 42 120
                L 60 88
                L 78 120
                M 60 88
                L 60 120
              "
              fill="none"
              stroke="url(#satDark)"
              strokeWidth="5.5"
              strokeLinejoin="round"
            />
            {/* Ground support plates */}
            <rect x="36" y="118" width="12" height="4" rx="1" fill="#263238" />
            <rect x="72" y="118" width="12" height="4" rx="1" fill="#263238" />
            <rect x="54" y="118" width="12" height="4" rx="1" fill="#263238" />

            {/* Main dish curved bowl */}
            <path
              d="
                M 24 55
                C 30 90, 90 90, 96 55
                C 90 75, 30 75, 24 55
                Z
              "
              fill="url(#satMetal)"
              stroke="#263238"
              strokeWidth="4"
            />
            <path
              d="
                M 24 55
                C 30 85, 90 85, 96 55
              "
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              opacity="0.5"
            />

            {/* Signal receiver horn supports */}
            <path
              d="
                M 36 68
                L 60 38
                L 84 68
              "
              fill="none"
              stroke="url(#satDark)"
              strokeWidth="3.5"
            />

            {/* Central signal receiver node */}
            <circle cx="60" cy="38" r="7" fill="#00e5ff" stroke="#263238" strokeWidth="3" />
            <circle cx="60" cy="38" r="2.5" fill="#ffffff" />
          </g>
        </svg>

        {/* Floating Percentage Indicator */}
        <div className={styles.percentageLabel}>
          <span>{Math.round(activeProgress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default SatelliteSignal;
