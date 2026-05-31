"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./StrawberryBar.module.css";

export interface StrawberryBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  showLabel?: boolean;
}

export const StrawberryBar: React.FC<StrawberryBarProps> = ({
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
              className={styles.strawberryLoaderSvg}
              viewBox="0 0 200 220"
              width="100%"
              height="100%"
            >
              <defs>
                <linearGradient id="skin-strawberry" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff5a6f" />
                  <stop offset="100%" stopColor="#cf172c" />
                </linearGradient>
                <linearGradient id="leaves-strawberry" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#82d986" />
                  <stop offset="100%" stopColor="#359f3b" />
                </linearGradient>
                <filter id="shadow-strawberry">
                  <feDropShadow dx="0" dy="10" stdDeviation="8" floodOpacity="0.15" />
                </filter>
              </defs>

              <g filter="url(#shadow-strawberry)">
                {/* Heart-Shaped Curvy Body */}
                <path
                  d="
                    M 100 45
                    C 40 45 30 95 35 135
                    C 40 175 80 212 100 212
                    C 120 212 160 175 165 135
                    C 170 95 160 45 100 45
                    Z
                  "
                  fill="url(#skin-strawberry)"
                />

                {/* Highlights */}
                <path
                  d="M 52 75 C 42 100 45 130 50 145"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Leaf Collar Group */}
                <g transform="translate(100, 48)">
                  {/* Center Leaf */}
                  <path d="M 0 5 C -12 -30 12 -30 0 5 Z" fill="url(#leaves-strawberry)" />
                  {/* Left Leaf 1 */}
                  <path d="M -2 5 C -30 -15 -10 -35 -2 5 Z" fill="url(#leaves-strawberry)" transform="rotate(-30)" />
                  {/* Right Leaf 1 */}
                  <path d="M 2 5 C 30 -15 10 -35 2 5 Z" fill="url(#leaves-strawberry)" transform="rotate(30)" />
                  {/* Left Leaf 2 */}
                  <path d="M -4 5 C -45 5 -25 -25 -4 5 Z" fill="url(#leaves-strawberry)" transform="rotate(-65)" />
                  {/* Right Leaf 2 */}
                  <path d="M 4 5 C 45 5 25 -25 4 5 Z" fill="url(#leaves-strawberry)" transform="rotate(65)" />
                </g>

                {/* Seed Dots */}
                <ellipse cx="70" cy="90" rx="2.2" ry="4" fill="#ffebae" transform="rotate(15 70 90)" />
                <ellipse cx="130" cy="90" rx="2.2" ry="4" fill="#ffebae" transform="rotate(-15 130 90)" />
                <ellipse cx="100" cy="115" rx="2.2" ry="4" fill="#ffebae" />
                <ellipse cx="65" cy="140" rx="2.2" ry="4" fill="#ffebae" transform="rotate(10 65 140)" />
                <ellipse cx="135" cy="140" rx="2.2" ry="4" fill="#ffebae" transform="rotate(-10 135 140)" />
                <ellipse cx="100" cy="165" rx="2.2" ry="4" fill="#ffebae" />
                <ellipse cx="80" cy="180" rx="2.2" ry="4" fill="#ffebae" transform="rotate(5 80 180)" />
                <ellipse cx="120" cy="180" rx="2.2" ry="4" fill="#ffebae" transform="rotate(-5 120 180)" />

                {/* Cute Blinking Face */}
                <g className={styles.face}>
                  <circle className={styles.eye} cx="85" cy="112" r="7.5" fill="#3b1d1d" />
                  <circle className={styles.eye} cx="115" cy="112" r="7.5" fill="#3b1d1d" />
                  <circle cx="72" cy="120" r="7.5" fill="#ff2244" opacity="0.45" />
                  <circle cx="128" cy="120" r="7.5" fill="#ff2244" opacity="0.45" />
                  <path d="M93 123 Q100 130 107 123" stroke="#3b1d1d" strokeWidth="4" strokeLinecap="round" fill="none" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {showLabel && (
        <div className={styles.labelContainer}>
          <span>Strawberry Loader</span>
          <span className={styles.percentLabel}>{Math.round(activeProgress)}%</span>
        </div>
      )}
    </div>
  );
};

export default StrawberryBar;
