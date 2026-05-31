"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./WatermelonBar.module.css";

export interface WatermelonBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  showLabel?: boolean;
}

export const WatermelonBar: React.FC<WatermelonBarProps> = ({
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
              <path d="M12 28c0 14 9 24 20 24s20-10 20-24H12z" fill="#2d6a31" />
              <path d="M15 28c0 11.5 7.5 20 17 20s17-8.5 17-20H15z" fill="#ffffff" opacity="0.9" />
              <path d="M17 28c0 10 6.5 17.5 15 17.5S47 38 47 28H17z" fill="#ff667e" />
              <path d="M22 33c-0.5 0-1-1-0.5-2 0.5-1 0.5-1 0.5-1s0 0 0.5 1c0.5 1 0 2-0.5 2z" fill="#3b2121" />
              <path d="M42 33c-0.5 0-1-1-0.5-2 0.5-1 0.5-1 0.5-1s0 0 0.5 1c0.5 1 0 2-0.5 2z" fill="#3b2121" />
              <g className={styles.face}>
                <circle cx="27" cy="33" r="2.5" fill="#3b2121" />
                <circle cx="37" cy="33" r="2.5" fill="#3b2121" />
                <circle cx="23" cy="36.5" r="2.5" fill="#ff3355" opacity="0.4" />
                <circle cx="41" cy="36.5" r="2.5" fill="#ff3355" opacity="0.4" />
                <path d="M30 35.5c1 1.5 3 1.5 4 0" stroke="#3b2121" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {showLabel && (
        <div className={styles.labelContainer}>
          <span>Watermelon Loader</span>
          <span className={styles.percentLabel}>{Math.round(activeProgress)}%</span>
        </div>
      )}
    </div>
  );
};

export default WatermelonBar;
