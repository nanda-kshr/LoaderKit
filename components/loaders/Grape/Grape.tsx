"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Grape.module.css";

export interface GrapeProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  color?: string;
  speed?: "slow" | "normal" | "fast";
}

interface GrapeNode {
  id: number;
  cx: number;
  cy: number;
  r: number;
  isFront?: boolean;
  biteStage: number;
  highlight?: { cx: number; cy: number; r: number };
}

const GRAPES: GrapeNode[] = [
  // BACK GRAPES
  { id: 1, cx: 130, cy: 246, r: 23, biteStage: 1, highlight: { cx: 122, cy: 238, r: 6 } },
  { id: 2, cx: 108, cy: 218, r: 24, biteStage: 1, highlight: { cx: 100, cy: 210, r: 6 } },

  { id: 3, cx: 152, cy: 218, r: 24, biteStage: 2, highlight: { cx: 144, cy: 210, r: 6 } },
  { id: 4, cx: 92, cy: 188, r: 23, biteStage: 2, highlight: { cx: 84, cy: 180, r: 6 } },
  { id: 5, cx: 170, cy: 188, r: 23, biteStage: 2, highlight: { cx: 162, cy: 180, r: 6 } },

  { id: 6, cx: 106, cy: 158, r: 24, biteStage: 3, highlight: { cx: 98, cy: 150, r: 6 } },
  { id: 7, cx: 154, cy: 158, r: 24, biteStage: 3, highlight: { cx: 146, cy: 150, r: 6 } },
  { id: 8, cx: 90, cy: 128, r: 23, biteStage: 3, highlight: { cx: 82, cy: 120, r: 6 } },

  { id: 9, cx: 170, cy: 128, r: 23, biteStage: 4, highlight: { cx: 162, cy: 120, r: 6 } },
  { id: 10, cx: 108, cy: 98, r: 24, biteStage: 4, highlight: { cx: 100, cy: 90, r: 6 } },
  { id: 11, cx: 152, cy: 98, r: 24, biteStage: 4, highlight: { cx: 144, cy: 90, r: 6 } },

  { id: 12, cx: 130, cy: 70, r: 23, biteStage: 5, highlight: { cx: 122, cy: 62, r: 6 } },
  
  // FRONT GRAPES
  { id: 13, cx: 130, cy: 188, r: 26, isFront: true, biteStage: 5, highlight: { cx: 122, cy: 180, r: 6 } },
  { id: 14, cx: 130, cy: 128, r: 26, isFront: true, biteStage: 6, highlight: { cx: 122, cy: 120, r: 6 } }
];

export const Grape: React.FC<GrapeProps> = ({
  size = 180,
  color = "#7a38d6",
  speed = "normal",
  className = "",
  style,
  ...props
}) => {
  const [biteStage, setBiteStage] = useState(0);
  const [isWobbling, setIsWobbling] = useState(false);
  const [effects, setEffects] = useState<
    Array<{ key: string; type: "crumb" | "juice"; style: React.CSSProperties }>
  >([]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const triggerEffects = useCallback((stage: number) => {
    // Find grapes chomped in this stage
    const eatenGrapes = GRAPES.filter((g) => g.biteStage === stage);
    if (eatenGrapes.length === 0) return;

    const newEffects: Array<{ key: string; type: "crumb" | "juice"; style: React.CSSProperties }> = [];

    eatenGrapes.forEach((g) => {
      // Spawn crumbs
      const numCrumbs = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < numCrumbs; i++) {
        const cSize = Math.random() * 5 + 3;
        const dx = (Math.random() - 0.5) * 40;
        const dy = Math.random() * 60 + 20;
        newEffects.push({
          key: `crumb-${Date.now()}-${Math.random()}`,
          type: "crumb",
          style: {
            width: `${cSize}px`,
            height: `${cSize}px`,
            top: `${g.cy}px`,
            left: `${g.cx}px`,
            background: Math.random() > 0.4 ? color : "#d8a4ff",
            "--crumb-dx": `${dx}px`,
            "--crumb-dy": `${dy}px`,
          } as React.CSSProperties,
        });
      }

      // Spawn juice drops
      const numJuice = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < numJuice; i++) {
        const dx = (Math.random() - 0.5) * 30;
        newEffects.push({
          key: `juice-${Date.now()}-${Math.random()}`,
          type: "juice",
          style: {
            top: `${g.cy + 10}px`,
            left: `${g.cx + dx}px`,
            background: "#9c5bf5",
          },
        });
      }
    });

    setEffects((prev) => [...prev, ...newEffects]);

    setTimeout(() => {
      setEffects((prev) => prev.filter((e) => !newEffects.some((ne) => ne.key === e.key)));
    }, 1000);
  }, [color]);

  const chomp = useCallback(() => {
    setIsWobbling(false);
    // Trigger tick-dependent state update
    setBiteStage((prev) => {
      const next = prev + 1;
      if (next > 6) {
        return 0; // reset
      }
      // Trigger particles
      triggerEffects(next);
      setIsWobbling(true);
      return next;
    });
  }, [triggerEffects]);

  // Wobble animation cleanup
  useEffect(() => {
    if (!isWobbling) return;
    const t = setTimeout(() => setIsWobbling(false), 400);
    return () => clearTimeout(t);
  }, [isWobbling]);

  // Automated biting interval
  useEffect(() => {
    let duration = 1200;
    if (speed === "slow") duration = 1800;
    if (speed === "fast") duration = 600;

    const interval = setInterval(chomp, duration);
    return () => clearInterval(interval);
  }, [speed, chomp]);

  const getFaceExpression = () => {
    if (biteStage <= 1) return "normal";
    if (biteStage <= 3) return "worried";
    if (biteStage <= 5) return "shocked";
    return "eaten";
  };

  const expression = getFaceExpression();
  const scaleVal = typeof size === "number" ? size / 65 : 0.65;

  return (
    <div
      className={`${styles.container} ${className}`}
      role="status"
      aria-label="Interactive Nibble Grape loader"
      onClick={chomp}
      style={{
        cursor: "pointer",
        ...style,
      }}
      {...props}
    >
      {/* Effect particles */}
      <div
        className={styles.effectOverlay}
        style={{
          transform: `translate(-50%, -50%) scale(${scaleVal * 0.5})`,
          transformOrigin: "center center",
        }}
      >
        {effects.map((e) => (
          <div
            key={e.key}
            className={e.type === "juice" ? styles.juiceDrop : styles.crumb}
            style={e.style}
          />
        ))}
      </div>

      <div
        className={styles.floorShadow}
        style={{
          transform: `scale(${scaleVal})`,
          transformOrigin: "center center",
        }}
      />

      <div
        className={`${styles.floatWrapper} ${isWobbling ? styles.wobble : ""}`}
        ref={wrapperRef}
        style={{
          width: "130px",
          height: "160px",
          transform: `scale(${scaleVal})`,
          transformOrigin: "center center",
        }}
      >
        <svg viewBox="0 0 260 320" width="100%" height="100%">
          <defs>
            <radialGradient id="grapeChompGradient" cx="35%" cy="30%">
              <stop offset="0%" stopColor="#d8a4ff" />
              <stop offset="100%" stopColor={color} />
            </radialGradient>
            <filter id="grapeChompShadow">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
            </filter>
          </defs>

          <g filter="url(#grapeChompShadow)">
            {/* Stem - only visible if top grapes are still there */}
            {biteStage < 5 && (
              <path
                d="M130 34 C130 14 146 8 162 16"
                stroke="#7a5a2a"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Leaf - only visible if top grapes are still there */}
            {biteStage < 5 && (
              <path
                d="M108 30 C88 15 70 38 84 58 C98 72 122 60 128 40 Z"
                fill="#72b74d"
              />
            )}

            {/* BACK GRAPES */}
            {GRAPES.filter((g) => !g.isFront).map((g) => (
              <circle
                key={g.id}
                cx={g.cx}
                cy={g.cy}
                r={g.r}
                fill="url(#grapeChompGradient)"
                className={`${styles.grapeNode} ${biteStage >= g.biteStage ? styles.grapeEaten : ""}`}
              />
            ))}

            {/* FRONT GRAPES */}
            {GRAPES.filter((g) => g.isFront).map((g) => (
              <circle
                key={g.id}
                cx={g.cx}
                cy={g.cy}
                r={g.r}
                fill="url(#grapeChompGradient)"
                className={`${styles.grapeNode} ${biteStage >= g.biteStage ? styles.grapeEaten : ""}`}
              />
            ))}

            {/* LARGE FLOATING UNIFIED FACE */}
            {biteStage < 6 && (
              <g className={styles.face}>
                {/* Normal Blinking Face */}
                {expression === "normal" && (
                  <>
                    <circle className={styles.eye} cx="105" cy="135" r="14" fill="#2f1346" />
                    <circle className={styles.eye} cx="155" cy="135" r="14" fill="#2f1346" />
                    <circle cx="85" cy="148" r="12" fill="#ffb6d7" opacity="0.45" />
                    <circle cx="175" cy="148" r="12" fill="#ffb6d7" opacity="0.45" />
                    <path
                      d="M 115 152 Q 130 170 145 152"
                      stroke="#2f1346"
                      strokeWidth="7"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </>
                )}

                {/* Worried Face */}
                {expression === "worried" && (
                  <>
                    <circle cx="105" cy="135" r="14" fill="#2f1346" />
                    <circle cx="155" cy="135" r="14" fill="#2f1346" />
                    <path
                      d="M93 115 Q105 120 115 110"
                      stroke="#2f1346"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M167 115 Q155 120 145 110"
                      stroke="#2f1346"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="85" cy="148" r="12" fill="#ffb6d7" opacity="0.45" />
                    <circle cx="175" cy="148" r="12" fill="#ffb6d7" opacity="0.45" />
                    <path
                      d="M118 156 Q130 144 142 156"
                      stroke="#2f1346"
                      strokeWidth="5.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </>
                )}

                {/* Shocked Face */}
                {expression === "shocked" && (
                  <>
                    <circle cx="102" cy="135" r="16" fill="#2f1346" />
                    <circle cx="158" cy="135" r="16" fill="#2f1346" />
                    <path
                      d="M93 110 Q105 106 115 110"
                      stroke="#2f1346"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M167 110 Q155 106 145 110"
                      stroke="#2f1346"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="130" cy="162" r="11" fill="#2f1346" />
                    {/* Sweat droplet */}
                    <path
                      d="M72 120 C70 114 65 114 65 120 C65 125 72 128 72 125"
                      fill="#aae4ff"
                    />
                  </>
                )}
              </g>
            )}

            {/* Highlights - only show if their respective grapes are not eaten */}
            {GRAPES.map((g) => {
              if (biteStage >= g.biteStage || !g.highlight) return null;
              return (
                <circle
                  key={`hl-${g.id}`}
                  cx={g.highlight.cx}
                  cy={g.highlight.cy}
                  r={g.highlight.r}
                  fill="rgba(255, 255, 255, 0.22)"
                  className={`${styles.grapeNode} ${biteStage >= g.biteStage ? styles.grapeEaten : ""}`}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Grape;
