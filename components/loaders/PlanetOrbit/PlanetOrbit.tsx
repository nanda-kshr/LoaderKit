"use client";

import React, { useEffect, useState } from "react";
import styles from "./PlanetOrbit.module.css";

export interface PlanetOrbitProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  size?: number | string;
  speed?: "slow" | "normal" | "fast";
  paused?: boolean;
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
}

export const PlanetOrbit: React.FC<PlanetOrbitProps> = ({
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

  // Automated progress simulation
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
      setInternalProgress((prev) => (prev >= 90 ? 0 : prev + 10));
    }
  };

  const scaleVal = typeof size === "number" ? size / 120 : 1;

  // Calculate planet position on orbit of radius 48 around center (80, 80)
  // start from top (-90 degrees / -Math.PI / 2)
  const angle = (activeProgress / 100) * 2 * Math.PI - Math.PI / 2;
  const planetX = 80 + Math.cos(angle) * 48;
  const planetY = 80 + Math.sin(angle) * 48;

  // SVG dash properties for the active progress orbit ring
  const r = 48;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - (activeProgress / 100) * circumference;

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
        height: typeof size === "number" ? `${size}px` : "auto",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
      {...props}
    >
      <div
        className={styles.orbitWrapper}
        style={{
          transform: `scale(${scaleVal})`,
          transformOrigin: "center center",
        }}
      >
        <svg viewBox="0 0 160 160" width="100%" height="100%" className={styles.orbitSvg}>
          <defs>
            <radialGradient id="sunGrad" cx="35%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#fff9c4" />
              <stop offset="40%" stopColor="#fbc02d" />
              <stop offset="100%" stopColor="#f57f17" />
            </radialGradient>

            <radialGradient id="planetGrad" cx="35%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#e0f7fa" />
              <stop offset="60%" stopColor="#00acc1" />
              <stop offset="100%" stopColor="#006064" />
            </radialGradient>

            <filter id="sunGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Space stars */}
          <g opacity="0.35" className={paused ? styles.pausedAnimations : ""}>
            <circle cx="20" cy="30" r="1" fill="#fff" className={styles.star1} />
            <circle cx="140" cy="40" r="1.5" fill="#fff" className={styles.star2} />
            <circle cx="35" cy="120" r="1" fill="#fff" className={styles.star3} />
            <circle cx="130" cy="130" r="1.2" fill="#fff" className={styles.star4} />
            <circle cx="80" cy="18" r="1.5" fill="#fff" className={styles.star5} />
          </g>

          {/* Dotted Orbit Path base */}
          <circle
            cx="80"
            cy="80"
            r="48"
            fill="none"
            stroke="var(--theme-border, rgba(255,255,255,0.08))"
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.5"
          />

          {/* Glowing Active Progress Orbit Ring */}
          <circle
            cx="80"
            cy="80"
            r="48"
            fill="none"
            stroke="#fbc02d"
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
            opacity="0.8"
          />

          {/* Central Sun */}
          <circle
            cx="80"
            cy="80"
            r="18"
            fill="url(#sunGrad)"
            filter="url(#sunGlow)"
            className={paused ? "" : styles.sunPulse}
          />

          {/* Orbiting Planet Group */}
          <g transform={`translate(${planetX}, ${planetY})`}>
            {/* Planet Body */}
            <circle
              cx="0"
              cy="0"
              r="7"
              fill="url(#planetGrad)"
              className={paused ? "" : styles.planetRotate}
            />

            {/* Orbiting Moon */}
            <circle
              cx="13"
              cy="0"
              r="2"
              fill="#e2e8f0"
              className={`${styles.moonOrbit} ${paused ? styles.pausedAnimations : ""}`}
            />
          </g>
        </svg>

        {/* Floating Percentage Tag */}
        <div className={styles.percentageLabel}>
          <span>{Math.round(activeProgress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default PlanetOrbit;
