"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./RocketAssembly.module.css";

export interface RocketAssemblyProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  size?: number | string;
  speed?: "slow" | "normal" | "fast";
  paused?: boolean;
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
}

export const RocketAssembly: React.FC<RocketAssemblyProps> = ({
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
  const [showBlastOff, setShowBlastOff] = useState(false);
  const activeProgress = customProgress !== undefined ? customProgress : internalProgress;

  const prevProgressRef = useRef(activeProgress);

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
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [customProgress, speed, paused]);

  // Blast-off animation control on reaching 100%
  useEffect(() => {
    const prev = prevProgressRef.current;

    if (activeProgress >= 100 && prev < 100) {
      setShowBlastOff(true);
      
      // Reset loop after blast off animation finished
      setTimeout(() => {
        setShowBlastOff(false);
        if (customProgress === undefined) {
          setInternalProgress(0);
        }
      }, 1800);
    }

    if (activeProgress < 10 && prev >= 95) {
      setShowBlastOff(false);
    }

    prevProgressRef.current = activeProgress;
  }, [activeProgress, customProgress]);

  const handleContainerClick = () => {
    if (!interactive) return;

    if (activeProgress >= 100) {
      setShowBlastOff(false);
      if (customProgress === undefined) {
        setInternalProgress(0);
      } else {
        onProgressChange?.(0);
      }
    } else {
      if (customProgress === undefined) {
        setInternalProgress(100);
      } else {
        onProgressChange?.(100);
      }
    }
  };

  const scaleVal = typeof size === "number" ? size / 120 : 1;

  // Determine which parts are currently visible/assembled
  // Part 1: Engine nozzle (Visible above 5%)
  // Part 2: Fuel Capsule (Visible above 25%)
  // Part 3: Nose Cabin (Visible above 50%)
  // Part 4: Stabilizer wings (Visible above 75%)
  const hasEngine = activeProgress > 5;
  const hasFuel = activeProgress > 25;
  const hasCabin = activeProgress > 50;
  const hasWings = activeProgress > 75;
  const isFullyAssembled = activeProgress >= 100;

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
        height: typeof size === "number" ? `${size * 1.3}px` : "auto",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
      {...props}
    >
      <div className={styles.floorShadow} />

      <div
        className={`${styles.rocketScene} ${showBlastOff ? styles.blastOffEffect : ""}`}
        style={{
          transform: `scale(${scaleVal})`,
          transformOrigin: "center bottom",
        }}
      >
        <svg viewBox="0 0 120 150" width="100%" height="100%" className={styles.rocketSvg}>
          <defs>
            <linearGradient id="rocketBodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#eceff1" />
              <stop offset="50%" stopColor="#cfd8dc" />
              <stop offset="100%" stopColor="#b0bec5" />
            </linearGradient>

            <linearGradient id="rocketRed" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff5252" />
              <stop offset="100%" stopColor="#c62828" />
            </linearGradient>
            
            <filter id="thrustGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Sparkles / Fire plume under engine at 100% */}
          {isFullyAssembled && (
            <g filter="url(#thrustGlow)" className={styles.thrustPlume}>
              {/* Central flame cone */}
              <polygon points="60,118 48,145 60,152 72,145" fill="#ffab40" />
              <polygon points="60,118 52,138 60,144 68,138" fill="#ffea00" />
              <circle cx="60" cy="142" r="6" fill="#ffffff" />
            </g>
          )}

          {/* PART 1: Engine nozzle (Y=105 to Y=118) */}
          {hasEngine && (
            <g className={activeProgress <= 25 ? styles.flyInBottom : ""}>
              <path d="M 46 105 L 74 105 L 78 118 L 42 118 Z" fill="#37474f" stroke="#1a252c" strokeWidth="3" />
              <rect x="52" y="105" width="16" height="3" fill="#cfd8dc" />
            </g>
          )}

          {/* PART 2: Fuel Capsule (Y=65 to Y=105) */}
          {hasFuel && (
            <g className={activeProgress <= 50 ? styles.flyInLeft : ""}>
              <rect x="36" y="65" width="48" height="40" rx="3" fill="url(#rocketBodyGrad)" stroke="#1a252c" strokeWidth="3.5" />
              {/* Stripe details */}
              <rect x="36" y="76" width="48" height="6" fill="url(#rocketRed)" />
              {/* Rivets */}
              <circle cx="44" cy="95" r="1.5" fill="#90a4ae" />
              <circle cx="76" cy="95" r="1.5" fill="#90a4ae" />
            </g>
          )}

          {/* PART 3: Nose Cabin (Y=20 to Y=65) */}
          {hasCabin && (
            <g className={activeProgress <= 75 ? styles.flyInRight : ""}>
              <path
                d="
                  M 36 65
                  C 36 40, 44 20, 60 20
                  C 76 20, 84 40, 84 65
                  Z
                "
                fill="url(#rocketBodyGrad)"
                stroke="#1a252c"
                strokeWidth="3.5"
              />
              {/* Circular window port */}
              <circle cx="60" cy="48" r="9" fill="#00e5ff" stroke="#1a252c" strokeWidth="3" />
              <circle cx="57" cy="45" r="3" fill="#ffffff" opacity="0.6" />
            </g>
          )}

          {/* PART 4: Stabilizer wings (left & right) */}
          {hasWings && (
            <g className={activeProgress <= 99 ? styles.flyInWings : ""}>
              {/* Left Wing */}
              <path d="M 36 85 L 18 112 L 36 105 Z" fill="url(#rocketRed)" stroke="#1a252c" strokeWidth="3" />
              {/* Right Wing */}
              <path d="M 84 85 L 102 112 L 84 105 Z" fill="url(#rocketRed)" stroke="#1a252c" strokeWidth="3" />
            </g>
          )}
        </svg>

        {/* Display percent inside rocket center */}
        <div className={styles.percentageLabel}>
          <span>{Math.round(activeProgress)}%</span>
        </div>

        {/* Banner indicating assembly stage */}
        <div className={styles.stageBanner}>
          <span>
            {!hasEngine
              ? "WAITING..."
              : !hasFuel
              ? "ENGINE LOCKED"
              : !hasCabin
              ? "FUEL TANK ON"
              : !hasWings
              ? "CABIN ATTACHED"
              : !isFullyAssembled
              ? "STABILIZING..."
              : "BLAST OFF!"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RocketAssembly;
