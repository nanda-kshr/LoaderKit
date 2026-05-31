"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./GrapeBar.module.css";

export interface GrapeBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  showLabel?: boolean;
}

export const GrapeBar: React.FC<GrapeBarProps> = ({
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
              className={styles.grapeLoaderSvg}
              viewBox="0 0 260 320"
              width="100%"
              height="100%"
            >
              <defs>
                <radialGradient id="grapeGradient-grape" cx="35%" cy="30%">
                  <stop offset="0%" stopColor="#d8a4ff"/>
                  <stop offset="100%" stopColor="#7a38d6"/>
                </radialGradient>

                <filter id="shadow-grape">
                  <feDropShadow
                    dx="0"
                    dy="8"
                    stdDeviation="8"
                    floodOpacity=".15"
                  />
                </filter>
              </defs>

              <g filter="url(#shadow-grape)">
                {/* stem */}
                <path
                  d="
                    M130 34
                    C130 14 146 8 162 16
                  "
                  stroke="#7a5a2a"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* leaf */}
                <path
                  d="
                    M108 30
                    C88 15 70 38 84 58
                    C98 72 122 60 128 40
                    Z
                  "
                  fill="#72b74d"
                />

                <g className={styles.cluster}>
                  {/* BACK GRAPES */}
                  <circle cx="130" cy="70" r="23" fill="url(#grapeGradient-grape)"/>

                  <circle cx="108" cy="98" r="24" fill="url(#grapeGradient-grape)"/>
                  <circle cx="152" cy="98" r="24" fill="url(#grapeGradient-grape)"/>

                  <circle cx="90" cy="128" r="23" fill="url(#grapeGradient-grape)"/>
                  <circle cx="170" cy="128" r="23" fill="url(#grapeGradient-grape)"/>

                  <circle cx="106" cy="158" r="24" fill="url(#grapeGradient-grape)"/>
                  <circle cx="154" cy="158" r="24" fill="url(#grapeGradient-grape)"/>

                  <circle cx="92" cy="188" r="23" fill="url(#grapeGradient-grape)"/>
                  <circle cx="170" cy="188" r="23" fill="url(#grapeGradient-grape)"/>

                  <circle cx="108" cy="218" r="24" fill="url(#grapeGradient-grape)"/>
                  <circle cx="152" cy="218" r="24" fill="url(#grapeGradient-grape)"/>

                  <circle cx="130" cy="246" r="23" fill="url(#grapeGradient-grape)"/>

                  {/* FRONT GRAPES */}
                  <circle cx="130" cy="128" r="26" fill="url(#grapeGradient-grape)"/>
                  <circle cx="130" cy="188" r="26" fill="url(#grapeGradient-grape)"/>

                  {/* highlights */}
                  <circle cx="122" cy="62" r="6" fill="rgba(255,255,255,.25)"/>
                  <circle cx="101" cy="90" r="6" fill="rgba(255,255,255,.25)"/>
                  <circle cx="145" cy="90" r="6" fill="rgba(255,255,255,.25)"/>
                  <circle cx="122" cy="120" r="6" fill="rgba(255,255,255,.25)"/>
                </g>

                {/* face floating over entire grape cluster */}
                <circle
                  className={styles.eye}
                  cx="105"
                  cy="135"
                  r="14"
                  fill="#2f1346"
                />
                <circle
                  className={styles.eye}
                  cx="155"
                  cy="135"
                  r="14"
                  fill="#2f1346"
                />

                {/* blush */}
                <circle
                  cx="85"
                  cy="148"
                  r="12"
                  fill="#ffb6d7"
                  opacity=".45"
                />
                <circle
                  cx="175"
                  cy="148"
                  r="12"
                  fill="#ffb6d7"
                  opacity=".45"
                />

                {/* smile */}
                <path
                  d="
                    M 115 152
                    Q 130 170 145 152
                  "
                  stroke="#2f1346"
                  strokeWidth="7"
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
          <span>Grape Loader</span>
          <span className={styles.percentLabel}>{Math.round(activeProgress)}%</span>
        </div>
      )}
    </div>
  );
};

export default GrapeBar;
