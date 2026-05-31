"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./PineappleBar.module.css";

export interface PineappleBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  showLabel?: boolean;
}

export const PineappleBar: React.FC<PineappleBarProps> = ({
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
            <svg viewBox="0 0 64 64" width="100%" height="100%">
              <path d="M26 22c-3-8 1-14 3-14s3 6 1 14z" fill="#22c55e" />
              <path d="M32 22c0-10 3-16 5-15s1 10-2 15z" fill="#15803d" />
              <path d="M38 22c3-8 5-11 7-10s-1 8-5 10z" fill="#22c55e" />
              <rect x="18" y="20" width="28" height="36" rx="14" ry="14" fill="#ffd13b" />
              <path d="M22 30l20 16 M20 38l16 16 M28 20l16 16 M42 30L22 46 M44 38L28 54 M36 20L20 36" stroke="#fca616" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
              <g className={styles.face}>
                <circle cx="26" cy="32" r="2.5" fill="#3b2314" />
                <circle cx="38" cy="32" r="2.5" fill="#3b2314" />
                <circle cx="21" cy="36" r="2.5" fill="#ff6b6b" opacity="0.5" />
                <circle cx="43" cy="36" r="2.5" fill="#ff6b6b" opacity="0.5" />
                <path d="M30 36c1 1.5 3 1.5 4 0" stroke="#3b2314" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {showLabel && (
        <div className={styles.labelContainer}>
          <span>Pineapple Loader</span>
          <span className={styles.percentLabel}>{Math.round(activeProgress)}%</span>
        </div>
      )}
    </div>
  );
};

export default PineappleBar;
