"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Watermelon.module.css";

export interface WatermelonProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  color?: string;
  speed?: "slow" | "normal" | "fast";
  biteColor?: string;
  rindColor?: string;
  variant?: "chomp" | "slice";
}

/* Spawn positions for crumbs relative to the scene center */
const CRUMB_SPAWNS = [
  { top: 30, left: 85 },
  { top: 35, left: 15 },
  { top: 25, left: 50 },
  { top: 40, left: 75 },
];

export const Watermelon: React.FC<WatermelonProps> = ({
  size = 40,
  color = "#ef4444",
  speed = "normal",
  biteColor = "var(--theme-card-bg, #ffffff)",
  rindColor = "#4ade80",
  variant = "chomp",
  className = "",
  style,
  ...props
}) => {
  const bitesRef = useRef<Array<HTMLDivElement | null>>([]);
  const sliceWrapperRef = useRef<HTMLDivElement>(null);
  const fleshRef = useRef<HTMLDivElement>(null);
  const seedGroupRef = useRef<HTMLDivElement>(null);
  const floorShadowRef = useRef<HTMLDivElement>(null);
  const biteCount = useRef(0);

  const [effects, setEffects] = useState<
    Array<{ key: string; type: "crumb" | "seed" | "juice"; style: React.CSSProperties }>
  >([]);

  const triggerEffects = useCallback(
    (leftVal: number, topVal: number) => {
      const newEffects: Array<{
        key: string;
        type: "crumb" | "seed" | "juice";
        style: React.CSSProperties;
      }> = [];

      // Crumbs
      const numCrumbs = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < numCrumbs; i++) {
        const cSize = Math.random() * 4 + 2;
        const offsetX = (Math.random() - 0.5) * 24;
        const left = Math.max(0, Math.min(140 - cSize, leftVal + offsetX));
        const top = Math.max(0, Math.min(160 - cSize, topVal));
        newEffects.push({
          key: `crumb-${Date.now()}-${Math.random()}`,
          type: "crumb",
          style: {
            width: `${cSize}px`,
            height: `${cSize}px`,
            top: `${top}px`,
            left: `${left}px`,
            background: Math.random() > 0.4 ? color : "#f87171",
          },
        });
      }

      // Flying seeds
      const numSeeds = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numSeeds; i++) {
        const dx = (Math.random() - 0.5) * 50;
        const dy = Math.random() * 25 + 15;
        newEffects.push({
          key: `seed-${Date.now()}-${Math.random()}`,
          type: "seed",
          style: {
            top: `${topVal + 5}px`,
            left: `${leftVal + (Math.random() - 0.5) * 10}px`,
            "--seed-dx": `${dx}px`,
            "--seed-dy": `${dy}px`,
          } as React.CSSProperties,
        });
      }

      // Juice drops
      const numJuice = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numJuice; i++) {
        newEffects.push({
          key: `juice-${Date.now()}-${Math.random()}`,
          type: "juice",
          style: {
            top: `${topVal + 15}px`,
            left: `${leftVal + (Math.random() - 0.5) * 20}px`,
            background: Math.random() > 0.5 ? color : "#fca5a5",
          },
        });
      }

      setEffects((prev) => [...prev, ...newEffects]);

      setTimeout(() => {
        setEffects((prev) =>
          prev.filter((e) => !newEffects.some((ne) => ne.key === e.key))
        );
      }, 1000);
    },
    [color]
  );

  // --- CHOMP VARIANT ---
  useEffect(() => {
    if (variant !== "chomp") return;

    let intervalDuration = 1000;
    if (speed === "slow") intervalDuration = 1500;
    if (speed === "fast") intervalDuration = 500;

    const updateFace = (bite: number) => {
      const flesh = fleshRef.current;
      if (!flesh) return;
      flesh.classList.remove(styles.worried, styles.shocked);
      if (bite <= 2) flesh.classList.add(styles.worried);
      else if (bite >= 3) flesh.classList.add(styles.shocked);
    };

    const takeBite = () => {
      const bites = bitesRef.current;
      const wrapper = sliceWrapperRef.current;
      const seedGroup = seedGroupRef.current;
      const shadow = floorShadowRef.current;

      if (!wrapper || !shadow) return;

      if (biteCount.current < bites.length) {
        bites[biteCount.current]?.classList.add(styles.biteActive);
        wrapper.classList.remove(styles.wobble);
        void wrapper.offsetWidth;
        wrapper.classList.add(styles.wobble);

        const spawnInfo = CRUMB_SPAWNS[biteCount.current];
        if (spawnInfo) triggerEffects(spawnInfo.left, spawnInfo.top);

        updateFace(biteCount.current + 1);

        if (biteCount.current === bites.length - 1) {
          if (seedGroup) seedGroup.style.opacity = "0";
          shadow.style.opacity = "0";
        }
        biteCount.current++;
      } else {
        // Reset
        biteCount.current = 0;
        bites.forEach((b) => b?.classList.remove(styles.biteActive));
        const flesh = fleshRef.current;
        if (flesh) flesh.classList.remove(styles.worried, styles.shocked);
        if (seedGroup) seedGroup.style.opacity = "1";
        shadow.style.opacity = "1";
      }
    };

    const interval = setInterval(takeBite, intervalDuration);
    return () => clearInterval(interval);
  }, [speed, variant, triggerEffects]);

  const scaleVal = typeof size === "number" ? size / 60 : 1;

  const customStyles: React.CSSProperties = {
    "--melon-color": color,
    "--bite-color": biteColor,
    "--rind-color": rindColor,
    transform: `scale(${scaleVal})`,
    transformOrigin: "center center",
    ...style,
  } as React.CSSProperties;

  const getEffectClassName = (type: string) => {
    if (type === "seed") return styles.flyingSeed;
    if (type === "juice") return styles.juiceDrop;
    return styles.crumb;
  };

  return (
    <div
      className={`${styles.container} ${className}`}
      role="status"
      aria-label="Watermelon loading animation"
      {...props}
    >
      <div className={styles.effectOverlay}>
        {effects.map((e) => (
          <div key={e.key} className={getEffectClassName(e.type)} style={e.style} />
        ))}
      </div>

      {variant === "chomp" ? (
        <>
          <div className={styles.floorShadow} ref={floorShadowRef} style={customStyles} />
          <div className={styles.floatWrapper} style={customStyles}>
            <div className={styles.sliceWrapper} ref={sliceWrapperRef}>
              <div className={styles.rind}>
                <div className={styles.rindGreen} style={{ background: rindColor }} />
                <div className={styles.rindWhite} />
                <div className={styles.flesh} ref={fleshRef} style={{ background: color }}>
                  {/* Face */}
                  <div className={styles.face}>
                    <div className={styles.eyes}>
                      <div className={styles.eye} />
                      <div className={styles.eye} />
                    </div>
                    <div className={styles.mouth} />
                  </div>

                  {/* Seeds */}
                  <div className={styles.seedGroup} ref={seedGroupRef}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={`seed-${i}`} className={`${styles.seed} ${styles[`seed${i}`]}`} />
                    ))}
                  </div>

                  {/* Bite overlays */}
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={`bite-${i}`}
                      className={`${styles.bite} ${styles[`bite${i + 1}`]}`}
                      ref={(el) => {
                        bitesRef.current[i] = el;
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.baseEdge} style={{ background: rindColor }} />
            </div>
          </div>
        </>
      ) : (
        /* ====== SLICE VARIANT (spinning slice with pulsing seeds) ====== */
        <div className={styles.sliceScene} style={customStyles}>
          <div className={styles.rotatingSlice}>
            <div className={styles.rind}>
              <div className={styles.rindGreen} style={{ background: rindColor }} />
              <div className={styles.rindWhite} />
              <div className={styles.flesh} style={{ background: color }}>
                {/* Pulsing seeds */}
                <div className={styles.pulseSeed} style={{ top: "45%", left: "25%" }} />
                <div className={styles.pulseSeed} style={{ top: "35%", left: "48%" }} />
                <div className={styles.pulseSeed} style={{ top: "50%", left: "65%" }} />
                <div className={styles.pulseSeed} style={{ top: "55%", left: "40%" }} />
              </div>
            </div>
            <div className={styles.baseEdge} style={{ background: rindColor }} />
            {/* Dripping juice */}
            <div className={styles.dripWrap}>
              <div className={styles.drip} style={{ background: color }} />
              <div className={styles.drip} style={{ background: color }} />
              <div className={styles.drip} style={{ background: color }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watermelon;
