"use client";

import React, { useEffect, useState } from "react";
import styles from "./PotionBrewing.module.css";

export interface PotionBrewingProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  size?: number | string;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  potionColor?: string;
}

export const PotionBrewing: React.FC<PotionBrewingProps> = ({
  progress: customProgress,
  size = 120,
  speed = "normal",
  interactive = true,
  onProgressChange,
  potionColor = "#ef4444", // standard magical health red elixir
  className = "",
  style,
  ...props
}) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const activeProgress = customProgress !== undefined ? customProgress : internalProgress;

  // Automated simulated progress
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
          return 0; // loop
        }
        onProgressChange?.(Math.round(next));
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [customProgress, speed, onProgressChange]);

  const handleBottleClick = () => {
    if (!interactive) return;

    // Fast-forward or trigger reset on click!
    if (customProgress === undefined) {
      setInternalProgress((prev) => (prev >= 90 ? 0 : prev + 15));
    }
  };

  const scaleVal = typeof size === "number" ? size / 120 : 1;

  // Liquid height scaling inside bottle (fill goes from Y=125 (empty) to Y=45 (full))
  const fillY = 125 - (activeProgress / 100) * 80;

  return (
    <div
      className={`${styles.container} ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(activeProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      onClick={handleBottleClick}
      style={{
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size * 1.25}px` : "auto",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
      {...props}
    >
      <div className={styles.steamContainer}>
        {/* Glowing floating steam bubbles */}
        <div className={`${styles.steamBubble} ${styles.steam1}`} style={{ background: potionColor }} />
        <div className={`${styles.steamBubble} ${styles.steam2}`} style={{ background: potionColor }} />
        <div className={`${styles.steamBubble} ${styles.steam3}`} style={{ background: potionColor }} />
      </div>

      <div className={styles.floorShadow} />

      <div
        className={styles.bottleWrapper}
        style={{
          transform: `scale(${scaleVal})`,
          transformOrigin: "center bottom",
        }}
      >
        <svg viewBox="0 0 120 150" width="100%" height="100%" className={styles.bottleSvg}>
          <defs>
            <radialGradient id="liquidGrad" cx="35%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#ff7b80" />
              <stop offset="60%" stopColor={potionColor} />
              <stop offset="100%" stopColor="#9b0e12" />
            </radialGradient>

            <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
              <stop offset="30%" stopColor="rgba(255, 255, 255, 0.15)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>

            {/* Clipping path of the internal bottle area to restrict rising liquid */}
            <clipPath id="bottleClip">
              <path
                d="
                  M 44 26
                  L 76 26
                  L 76 50
                  C 76 50, 104 80, 104 105
                  C 104 128, 86 134, 60 134
                  C 34 134, 16 128, 16 105
                  C 16 80, 44 50, 44 50
                  Z
                "
              />
            </clipPath>
          </defs>

          {/* Bottle Back Liquid - with clipping */}
          <g clipPath="url(#bottleClip)">
            {/* Background glass color */}
            <rect x="0" y="0" width="120" height="150" fill="#1b1220" opacity="0.3" />

            {/* Fills Liquid Box */}
            <rect
              x="10"
              y={fillY}
              width="100"
              height="140"
              fill="url(#liquidGrad)"
              className={styles.potionLiquid}
            />

            {/* Wave Surface Details */}
            {activeProgress > 0 && activeProgress < 100 && (
              <path
                d={`
                  M 12 ${fillY} 
                  Q 35 ${fillY - 4}, 60 ${fillY} 
                  T 108 ${fillY}
                  L 108 ${fillY + 12}
                  L 12 ${fillY + 12}
                  Z
                `}
                fill="#ffd5d6"
                opacity="0.75"
                className={styles.liquidWave}
              />
            )}

            {/* Bubbles floating up inside the liquid */}
            {activeProgress > 5 && (
              <g className={styles.liquidBubbles} opacity="0.8">
                <circle cx="35" cy="110" r="3.5" fill="#ffa4a6" className={styles.bBubble1} />
                <circle cx="50" cy="98" r="2.5" fill="#ffa4a6" className={styles.bBubble2} />
                <circle cx="85" cy="120" r="4.5" fill="#ffa4a6" className={styles.bBubble3} />
                <circle cx="70" cy="105" r="3" fill="#ffa4a6" className={styles.bBubble4} />
                <circle cx="42" cy="85" r="2.5" fill="#ffa4a6" className={styles.bBubble5} />
                <circle cx="62" cy="92" r="3.5" fill="#ffa4a6" className={styles.bBubble6} />
              </g>
            )}
          </g>

          {/* Outer Glass Bottle Outline */}
          <path
            d="
              M 44 26
              L 76 26
              L 76 50
              C 76 50, 104 80, 104 105
              C 104 128, 86 134, 60 134
              C 34 134, 16 128, 16 105
              C 16 80, 44 50, 44 50
              Z
            "
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Lip of the beaker flask */}
          <rect x="38" y="20" width="44" height="6" rx="2" ry="2" fill="none" stroke="#ffffff" strokeWidth="4" />

          {/* Measurement ticks on flask side */}
          <g stroke="#ffffff" strokeWidth="2.5" opacity="0.45" strokeLinecap="round">
            <line x1="42" y1="110" x2="52" y2="110" />
            <line x1="48" y1="90" x2="56" y2="90" />
            <line x1="52" y1="70" x2="60" y2="70" />
          </g>

          {/* Sleek highlight glare on glass front */}
          <path
            d="
              M 26 102
              C 26 90, 48 55, 48 55
            "
            fill="none"
            stroke="url(#glassSheen)"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>

        {/* Display percent inside bottle neck */}
        <div className={styles.percentageLabel}>
          <span>{Math.round(activeProgress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default PotionBrewing;
