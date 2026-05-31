"use client";

import React from "react";
import styles from "./WizardSpell.module.css";

export interface WizardSpellProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  speed?: "slow" | "normal" | "fast";
  color?: string;
}

export const WizardSpell: React.FC<WizardSpellProps> = ({
  size = 120,
  speed = "normal",
  color = "#7c3aed",
  className = "",
  style,
  ...props
}) => {
  const ringDuration = speed === "slow" ? 4.8 : speed === "fast" ? 2.4 : 3.4;
  const orbitDuration = speed === "slow" ? 6.2 : speed === "fast" ? 3.2 : 4.6;
  const runeAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  const orbitAngles = [15, 105, 195, 285];

  return (
    <div
      className={`${styles.container} ${className}`}
      style={
        {
          width: typeof size === "number" ? `${size}px` : size,
          height: typeof size === "number" ? `${size}px` : size,
          "--spell-color": color,
          "--ring-duration": `${ringDuration}s`,
          "--orbit-duration": `${orbitDuration}s`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <svg className={styles.spellSvg} viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <radialGradient id="spell-core" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="70%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <filter id="spell-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle className={styles.outerRing} cx="100" cy="100" r="78" />
        <circle className={styles.innerRing} cx="100" cy="100" r="58" />

        <g className={styles.runes} filter="url(#spell-glow)">
          {runeAngles.map((angle) => (
            <polygon
              key={angle}
              className={styles.rune}
              points="100,16 106,30 100,44 94,30"
              transform={`rotate(${angle} 100 100)`}
            />
          ))}
        </g>

        <g className={styles.orbit}>
          {orbitAngles.map((angle) => (
            <circle
              key={angle}
              className={styles.orbitDot}
              cx="100"
              cy="22"
              r="5"
              transform={`rotate(${angle} 100 100)`}
            />
          ))}
        </g>

        <circle className={styles.core} cx="100" cy="100" r="22" fill="url(#spell-core)" />
        <path
          className={styles.sigils}
          d="M100 62 L112 88 L138 92 L118 110 L122 136 L100 124 L78 136 L82 110 L62 92 L88 88 Z"
        />
      </svg>
    </div>
  );
};

export default WizardSpell;
