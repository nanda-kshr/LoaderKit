"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./AvocadoBar.module.css";

export interface AvocadoBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  showLabel?: boolean;
}

export const AvocadoBar: React.FC<AvocadoBarProps> = ({
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
              className={styles.avocadoLoaderSvg}
              viewBox="0 0 240 280"
              width="100%"
              height="100%"
            >
              <defs>
                <linearGradient id="skin-avocado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9ccc65"/>
                  <stop offset="100%" stopColor="#689f38"/>
                </linearGradient>

                <linearGradient id="flesh-avocado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eef7a1"/>
                  <stop offset="100%" stopColor="#cde66f"/>
                </linearGradient>

                <radialGradient id="pit-avocado" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="#c28a4d"/>
                  <stop offset="100%" stopColor="#81502a"/>
                </radialGradient>

                <filter id="shadow-avocado">
                  <feDropShadow
                    dx="0"
                    dy="10"
                    stdDeviation="10"
                    floodOpacity="0.15"
                  />
                </filter>
              </defs>

              <g filter="url(#shadow-avocado)">
                {/* Outer Shell */}
                <path
                  d="
                  M 100 25
                  C 65 25 70 55 66 77
                  C 60 103 35 123 33 165
                  C 42 210 75 225 100 225
                  C 125 225 162 208 168 175
                  C 172 122 150 116 137 76
                  C 136 59 135 25 100 25
                  Z
                  "
                  fill="url(#skin-avocado)"
                />

                {/* Highlight */}
                <path
                  d="
                  M82 42
                  C72 68 65 100 65 145
                  "
                  stroke="rgba(255,255,255,.18)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Inner Flesh */}
                <path
                  d="
                  M 104 30
                  C 97 29 90 33 83 41
                  C 75 46 75 71 73 88
                  C 61 105 40 150 41 167
                  C 44 189 71 222 100 219
                  C 127 219 148 204 158 175
                  C 161 153 144 116 130 87
                  C 128 72 129 43 111 33
                  Z
                  "
                  fill="url(#flesh-avocado)"
                />

                {/* Seed */}
                <g className={styles.seed}>
                  <ellipse
                    cx="105"
                    cy="165"
                    rx="28"
                    ry="34"
                    fill="url(#pit-avocado)"
                  />
                  <ellipse
                    cx="98"
                    cy="152"
                    rx="7"
                    ry="9"
                    fill="rgba(255,255,255,.25)"
                  />
                </g>

                {/* Blush */}
                <circle
                  cx="80"
                  cy="112"
                  r="5"
                  fill="#ffb6b6"
                  opacity=".45"
                />
                <circle
                  cx="126"
                  cy="112"
                  r="5"
                  fill="#ffb6b6"
                  opacity=".45"
                />

                {/* Eyes */}
                <circle
                  className={styles.eye}
                  cx="90"
                  cy="105"
                  r="3.5"
                  fill="#453020"
                />
                <circle
                  className={styles.eye}
                  cx="116"
                  cy="105"
                  r="3.5"
                  fill="#453020"
                />

                {/* Smile */}
                <path
                  d="
                  M96 118
                  Q103 128 109 118
                  "
                  stroke="#453020"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {showLabel && (
        <div className={styles.labelContainer}>
          <span>Avocado Loader</span>
          <span className={styles.percentLabel}>{Math.round(activeProgress)}%</span>
        </div>
      )}
    </div>
  );
};

export default AvocadoBar;
