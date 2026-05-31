"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./LootChest.module.css";

export interface LootChestProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  size?: number | string;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
}

interface TreasureParticle {
  id: string;
  type: "coin" | "gem" | "sparkle";
  color: string;
  style: React.CSSProperties;
}

export const LootChest: React.FC<LootChestProps> = ({
  progress: customProgress,
  size = 120,
  speed = "normal",
  interactive = true,
  onProgressChange,
  className = "",
  style,
  ...props
}) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const [particles, setParticles] = useState<TreasureParticle[]>([]);
  const explodedRef = useRef(false);

  const activeProgress = customProgress !== undefined ? customProgress : internalProgress;

  const triggerExplosion = useCallback(() => {
    const numParticles = 22;
    const newParticles: TreasureParticle[] = [];
    const colors = ["#ffca28", "#ffd54f", "#4fc3f7", "#b2ff59", "#ea80fc", "#ff8a80"];

    for (let i = 0; i < numParticles; i++) {
      const type = Math.random() > 0.6 ? "gem" : Math.random() > 0.4 ? "coin" : "sparkle";
      const color = colors[Math.floor(Math.random() * colors.length)];
      const cSize = type === "sparkle" ? Math.random() * 8 + 6 : Math.random() * 12 + 10;
      
      const angle = Math.random() * Math.PI + Math.PI; // upward arc (180 to 360 deg)
      const force = Math.random() * 120 + 60;
      const dx = Math.cos(angle) * force;
      const dy = Math.sin(angle) * force - 30; // boost height

      newParticles.push({
        id: `treasure-${Date.now()}-${Math.random()}`,
        type,
        color,
        style: {
          width: `${cSize}px`,
          height: `${cSize}px`,
          "--dx": `${dx}px`,
          "--dy": `${dy}px`,
          top: "45%",
          left: "50%",
          background: type === "coin" ? "#ffca28" : type === "gem" ? color : "transparent",
          boxShadow: type === "coin" ? "inset -2px -2px 0px #b78a00, 0px 4px 6px rgba(0,0,0,0.15)" : "none",
          border: type === "sparkle" ? `2px solid ${color}` : "none",
        } as React.CSSProperties,
      });
    }

    setParticles(newParticles);
    explodedRef.current = true;

    // Clear particles after animation
    setTimeout(() => {
      setParticles([]);
    }, 1500);
  }, []);

  // Automated progress simulation if not customized
  useEffect(() => {
    if (customProgress !== undefined) return;

    let step = 1;
    let intervalTime = 50;

    if (speed === "slow") {
      step = 0.5;
      intervalTime = 70;
    } else if (speed === "fast") {
      step = 2;
      intervalTime = 30;
    }

    const interval = setInterval(() => {
      setInternalProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          if (!explodedRef.current) {
            triggerExplosion();
            explodedRef.current = true;
          }
          onProgressChange?.(100);
          return 100;
        }
        onProgressChange?.(Math.round(next));
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [customProgress, speed, onProgressChange, triggerExplosion]);

  const handleManualClick = () => {
    if (!interactive) return;
    
    // If completed, let's reset to 0 to watch it shake and open again!
    if (activeProgress >= 100) {
      if (customProgress === undefined) {
        setInternalProgress(0);
        explodedRef.current = false;
      } else {
        onProgressChange?.(0);
        explodedRef.current = false;
      }
    } else {
      // Direct explosion preview on click!
      if (!explodedRef.current) {
        triggerExplosion();
      }
    }
  };

  const scaleVal = typeof size === "number" ? size / 120 : 1;
  const isOpened = activeProgress >= 100;
  
  // Shake intensity increases as progress goes higher
  const shakeClass = isOpened
    ? ""
    : activeProgress > 80
    ? styles.shakeExtreme
    : activeProgress > 50
    ? styles.shakeMedium
    : activeProgress > 15
    ? styles.shakeLight
    : "";

  return (
    <div
      className={`${styles.container} ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(activeProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      onClick={handleManualClick}
      style={{
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : "auto",
        cursor: interactive ? "pointer" : "default",
        ...style,
      }}
      {...props}
    >
      <div className={styles.particlesOverlay}>
        {particles.map((p) => {
          if (p.type === "sparkle") {
            return (
              <div key={p.id} className={`${styles.particle} ${styles.sparkle}`} style={p.style} />
            );
          }
          if (p.type === "gem") {
            return (
              <div key={p.id} className={`${styles.particle} ${styles.gem}`} style={p.style}>
                <svg viewBox="0 0 24 24" width="100%" height="100%">
                  <polygon points="12,2 22,9 12,22 2,9" fill={p.color} />
                  <polygon points="12,2 17,9 12,14 7,9" fill="rgba(255,255,255,0.4)" />
                </svg>
              </div>
            );
          }
          return (
            <div key={p.id} className={`${styles.particle} ${styles.coin}`} style={p.style} />
          );
        })}
      </div>

      <div className={styles.floorShadow} />

      <div
        className={`${styles.chestWrapper} ${shakeClass}`}
        style={{
          transform: `scale(${scaleVal})`,
          transformOrigin: "center bottom",
        }}
      >
        <svg viewBox="0 0 160 160" width="100%" height="100%" className={styles.chestSvg}>
          <defs>
            <linearGradient id="chestGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe082" />
              <stop offset="100%" stopColor="#ffb300" />
            </linearGradient>
            <linearGradient id="chestWood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a76f44" />
              <stop offset="100%" stopColor="#5d381b" />
            </linearGradient>
            <filter id="chestGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Treasure Shine/Glow at 100% */}
          {isOpened && (
            <g filter="url(#chestGlow)" className={styles.chestLightBurst}>
              <circle cx="80" cy="75" r="45" fill="rgba(255, 215, 0, 0.45)" />
              <path
                d="M80 15 L80 135 M20 75 L140 75 M35 30 L125 120 M125 30 L35 120"
                stroke="#fff7c2"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.75"
              />
            </g>
          )}

          {/* Bottom Chest Base */}
          <g className={styles.chestBase}>
            {/* Box Main Body */}
            <rect x="25" y="80" width="110" height="60" rx="8" ry="8" fill="url(#chestWood)" stroke="#1a0c02" strokeWidth="5" />
            {/* Iron corners */}
            <rect x="25" y="80" width="15" height="60" rx="2" fill="#5c5d64" stroke="#1a0c02" strokeWidth="4" />
            <rect x="120" y="80" width="15" height="60" rx="2" fill="#5c5d64" stroke="#1a0c02" strokeWidth="4" />
            {/* Bottom rim */}
            <rect x="25" y="132" width="110" height="8" fill="#3b3d44" stroke="#1a0c02" strokeWidth="3" />
          </g>

          {/* Golden Treasure interior - visible only if chest is open */}
          {isOpened && (
            <g className={styles.interiorGlow}>
              <rect x="35" y="70" width="90" height="15" rx="5" fill="url(#chestGold)" />
              <circle cx="50" cy="72" r="8" fill="#ffd54f" />
              <circle cx="70" cy="68" r="9" fill="#ffca28" />
              <circle cx="90" cy="70" r="8" fill="#ffd54f" />
              <circle cx="110" cy="73" r="7" fill="#ffe082" />
              {/* Floating gems */}
              <polygon points="60,65 65,72 60,78 55,72" fill="#ea80fc" />
              <polygon points="100,66 104,72 100,77 96,72" fill="#80d8ff" />
            </g>
          )}

          {/* Top Chest Lid (animates rotation/translate up on completion) */}
          <g className={`${styles.chestLid} ${isOpened ? styles.lidOpened : ""}`}>
            {/* Lid Main */}
            <path
              d="
                M 25 80 
                C 25 40, 135 40, 135 80
                Z
              "
              fill="url(#chestWood)"
              stroke="#1a0c02"
              strokeWidth="5"
            />
            {/* Iron bands */}
            <path d="M 25 80 C 25 40, 40 40, 40 80" fill="none" stroke="#5c5d64" strokeWidth="6" />
            <path d="M 120 80 C 120 40, 135 40, 135 80" fill="none" stroke="#5c5d64" strokeWidth="6" />
            {/* Front golden locking shield */}
            <path
              d="
                M 70 70 
                L 90 70 
                L 95 90
                L 80 100
                L 65 90
                Z
              "
              fill="url(#chestGold)"
              stroke="#1a0c02"
              strokeWidth="4"
            />
            {/* Lock keyhole */}
            <circle cx="80" cy="85" r="3.5" fill="#110701" />
            <rect x="78.5" y="85" width="3" height="8" rx="1" fill="#110701" />
          </g>
        </svg>

        {/* Completion indicator level banner */}
        {isOpened && (
          <div className={styles.banner}>
            <span>UNLOCKED!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LootChest;
