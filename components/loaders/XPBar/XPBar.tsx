"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./XPBar.module.css";

export interface XPBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  showLabels?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({
  progress: customProgress,
  speed = "normal",
  interactive = true,
  onProgressChange,
  showLabels = true,
  className = "",
  style,
  ...props
}) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: string; style: React.CSSProperties }[]>([]);

  const activeProgress = customProgress !== undefined ? customProgress : internalProgress;
  const prevProgressRef = useRef(activeProgress);

  // Simulated auto-progress
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
          // Automated level up!
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [customProgress, speed]);

  // Monitor progression transitions
  useEffect(() => {
    const prev = prevProgressRef.current;
    
    // Level Up triggers when progress crosses or hits 100%
    if (activeProgress >= 100 && prev < 100) {
      setShowLevelUp(true);
      setCurrentLevel((lvl) => lvl + 1);

      // Trigger sparkle explosions
      const newSparkles = Array.from({ length: 12 }).map(() => {
        const x = Math.random() * 90 + 5; // offset percent
        const y = Math.random() * 60 - 20; // vertical offset
        const scale = Math.random() * 0.7 + 0.6;
        return {
          id: `sparkle-${Date.now()}-${Math.random()}`,
          style: {
            left: `${x}%`,
            top: `${y}px`,
            transform: `scale(${scale})`,
          } as React.CSSProperties,
        };
      });
      setSparkles(newSparkles);

      // Clear level up splash and sparkles after timeout
      setTimeout(() => {
        setShowLevelUp(false);
        setSparkles([]);
        // Reset simulated bar to loop
        if (customProgress === undefined) {
          setInternalProgress(0);
        }
      }, 1600);
    }
    
    // If progress is manual and decreases, allow resetting states
    if (activeProgress < 10 && prev >= 95) {
      setShowLevelUp(false);
    }

    prevProgressRef.current = activeProgress;
  }, [activeProgress, customProgress]);

  // Click on the bar level banner to level up or scrub!
  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, Math.round((relativeX / rect.width) * 100)));

    if (customProgress === undefined) {
      setInternalProgress(pct);
    }
    onProgressChange?.(pct);
  };

  return (
    <div
      className={`${styles.container} ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(activeProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={style}
      {...props}
    >
      {/* RPG header info */}
      {showLabels && (
        <div className={styles.headerInfo}>
          <div className={styles.levelBadge}>
            <span className={styles.lvlLabel}>LV</span>
            <span className={styles.lvlValue}>{currentLevel}</span>
          </div>
          <div className={styles.xpFraction}>
            <span>{Math.round(activeProgress * 78)}</span>
            <span className={styles.slash}>/</span>
            <span>7800 XP</span>
          </div>
        </div>
      )}

      {/* Main Bar Track */}
      <div
        className={styles.xpTrack}
        onClick={handleBarClick}
        style={{ cursor: interactive ? "pointer" : "default" }}
      >
        <div
          className={styles.xpFill}
          style={{ width: `${activeProgress}%` }}
        >
          <div className={styles.fillGlow} />
          <div className={styles.fillStripe} />
          <div className={styles.fillSheen} />
        </div>

        {/* Level Up floating text overlay */}
        {showLevelUp && (
          <div className={styles.levelUpSplash}>
            <span>LEVEL UP!</span>
          </div>
        )}

        {/* Level Up sparkles */}
        {sparkles.map((sp) => (
          <div key={sp.id} className={styles.sparkle} style={sp.style}>
            <svg viewBox="0 0 24 24" width="100%" height="100%">
              <path d="M12,0 L14,8 L22,10 L14,12 L12,20 L10,12 L2,10 L10,8 Z" fill="#ffd700" />
            </svg>
          </div>
        ))}
      </div>

      {/* RPG bottom stats/footer info */}
      {showLabels && (
        <div className={styles.footerInfo}>
          <span>EXPERIENCE GAINED</span>
          <span className={styles.percentage}>{Math.round(activeProgress)}%</span>
        </div>
      )}
    </div>
  );
};

export default XPBar;
