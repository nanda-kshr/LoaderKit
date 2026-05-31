"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./CarrotBar.module.css";

export interface CarrotBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  showLabel?: boolean;
}

export const CarrotBar: React.FC<CarrotBarProps> = ({
  progress: customProgress,
  speed = "normal",
  interactive = true,
  onProgressChange,
  showLabel = true,
  className = "",
  style,
  ...props
}) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const activeProgress = customProgress !== undefined ? customProgress : internalProgress;

  useEffect(() => {
    if (customProgress !== undefined || isScrubbing) return;

    let step = 1;
    let intervalTime = 60;

    if (speed === "slow") {
      step = 0.5;
      intervalTime = 80;
    } else if (speed === "fast") {
      step = 1.5;
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
  }, [customProgress, speed, isScrubbing, onProgressChange]);

  const handleUpdateProgress = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, Math.round((relativeX / rect.width) * 100)));

      if (customProgress === undefined) {
        setInternalProgress(pct);
      }
      onProgressChange?.(pct);
    },
    [customProgress, onProgressChange]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    setIsScrubbing(true);
    handleUpdateProgress(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!interactive) return;
    setIsScrubbing(true);
    if (e.touches[0]) {
      handleUpdateProgress(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    if (!isScrubbing) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleUpdateProgress(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleUpdateProgress(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      setIsScrubbing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isScrubbing, handleUpdateProgress]);

  return (
    <div
      className={`${styles.container} ${isScrubbing ? styles.scrubbing : ""} ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(activeProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
      style={style}
    >
      <div className={styles.wrapper}>
        <div
          ref={trackRef}
          className={`${styles.track} ${interactive ? styles.trackInteractive : ""}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div
            className={styles.fill}
            style={{ width: `${activeProgress}%` }}
          >
            <div className={styles.shimmer} />
          </div>
        </div>

        <div
          className={styles.thumbContainer}
          style={{ left: `${activeProgress}%` }}
        >
          <div className={styles.thumbInner}>
            <svg
              className={styles.carrotLoaderSvg}
              viewBox="0 0 100 150"
              width="100%"
              height="100%"
            >
              <defs>
                <linearGradient id="carrot-skin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffb74d" />
                  <stop offset="100%" stopColor="#ff9800" />
                </linearGradient>
                <linearGradient id="carrot-leaves" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#81c784" />
                  <stop offset="100%" stopColor="#4caf50" />
                </linearGradient>
                <filter id="shadow-carrot">
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
                </filter>
              </defs>

              <g filter="url(#shadow-carrot)">
                {/* Leaves */}
                <g transform="translate(50, 45)">
                  {/* Left Leaf */}
                  <path d="M-6,0 C-18,-15 -18,-35 -6,-35 C6,-35 2,-15 -2,0 Z" fill="url(#carrot-leaves)" transform="rotate(-30)" />
                  {/* Right Leaf */}
                  <path d="M6,0 C18,-15 18,-35 6,-35 C-6,-35 -2,-15 2,0 Z" fill="url(#carrot-leaves)" transform="rotate(30)" />
                  {/* Center Leaf */}
                  <path d="M0,0 C-10,-20 -10,-45 0,-45 C10,-45 10,-20 0,0 Z" fill="url(#carrot-leaves)" />
                </g>

                {/* Carrot Body */}
                <path
                  d="
                  M 50 40
                  C 28 40 28 48 30 70
                  C 32 95 40 120 50 140
                  C 60 120 68 95 70 70
                  C 72 48 72 40 50 40
                  Z
                  "
                  fill="url(#carrot-skin)"
                />

                {/* Highlights */}
                <path
                  d="M36 52 C33 65 34 85 36 100"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Subtle texture lines */}
                <path d="M65 65 Q58 63 55 65" stroke="rgba(0,0,0,0.08)" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M35 85 Q42 83 45 85" stroke="rgba(0,0,0,0.08)" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M63 105 Q58 103 55 105" stroke="rgba(0,0,0,0.08)" strokeWidth="2" strokeLinecap="round" fill="none" />

                {/* Face */}
                <g className={styles.face} transform="translate(50, 68)">
                  {/* Eyes */}
                  <circle className={styles.eye} cx="-10" cy="0" r="3" fill="#4a3623" />
                  <circle className={styles.eye} cx="10" cy="0" r="3" fill="#4a3623" />
                  {/* Blush */}
                  <circle cx="-16" cy="5" r="4" fill="#fda4af" opacity="0.6" />
                  <circle cx="16" cy="5" r="4" fill="#fda4af" opacity="0.6" />
                  {/* Mouth */}
                  <path d="M-4 6 Q0 12 4 6" stroke="#4a3623" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {showLabel && (
        <div className={styles.labelContainer}>
          <span>Carrot Loader</span>
          <span className={styles.percentLabel}>{Math.round(activeProgress)}%</span>
        </div>
      )}
    </div>
  );
};

export default CarrotBar;
