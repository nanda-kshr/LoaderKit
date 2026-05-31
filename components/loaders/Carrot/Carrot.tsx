"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Carrot.module.css";

export interface CarrotProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  color?: string;
  speed?: "slow" | "normal" | "fast";
  biteColor?: string;
  leafColor?: string;
  variant?: "nibble" | "bunny";
}

const CRUMB_SPAWNS = [
  { top: 125, left: 70 },
  { top: 105, left: 65 },
  { top: 85, left: 80 },
  { top: 70, left: 60 },
  { top: 50, left: 75 },
];

export const Carrot: React.FC<CarrotProps> = ({
  size = 40,
  color = "#ff9e43",
  speed = "normal",
  biteColor = "var(--theme-card-bg, #ffffff)",
  leafColor = "#7dd181",
  variant = "nibble",
  className = "",
  style,
  ...props
}) => {
  // Nibble refs
  const bitesRef = useRef<Array<HTMLDivElement | null>>([]);
  const carrotWrapperRef = useRef<HTMLDivElement>(null);
  const carrotBodyRef = useRef<HTMLDivElement>(null);
  const leavesRef = useRef<HTMLDivElement>(null);
  const floorShadowRef = useRef<HTMLDivElement>(null);
  const biteCount = useRef(0);

  // Bunny refs
  const bunnyBitesRef = useRef<Array<HTMLDivElement | null>>([]);
  const bunnyCarrotRef = useRef<HTMLDivElement>(null);
  const bunnyLeavesRef = useRef<HTMLDivElement>(null);

  // Shared crumb effects
  const [effects, setEffects] = useState<
    Array<{ key: string; style: React.CSSProperties }>
  >([]);

  // Bunny animation state
  const [bunnyPos, setBunnyPos] = useState("bunnyPosIdle");
  const [bunnyEyeStyle, setBunnyEyeStyle] = useState("bEyeNormal");
  const [bunnyMouthStyle, setBunnyMouthStyle] = useState("bMouthNormal");
  const [bunnyCheeksVisible, setBunnyCheeksVisible] = useState(false);
  const [bunnyCarrotFace, setBunnyCarrotFace] = useState<"" | "worried" | "shocked">("");
  const bunnyBiteCount = useRef(0);

  const triggerCrumbs = useCallback((leftVal: number, topVal: number) => {
    const numCrumbs = Math.floor(Math.random() * 3) + 3;
    const newEffects: Array<{ key: string; style: React.CSSProperties }> = [];

    for (let i = 0; i < numCrumbs; i++) {
      const cSize = Math.random() * 4 + 2;
      const offsetX = (Math.random() - 0.5) * 20;
      const left = Math.max(0, Math.min(150 - cSize, leftVal + offsetX));
      const top = Math.max(0, Math.min(200 - cSize, topVal));

      newEffects.push({
        key: `crumb-${Date.now()}-${Math.random()}`,
        style: {
          width: `${cSize}px`,
          height: `${cSize}px`,
          top: `${top}px`,
          left: `${left}px`,
          background: Math.random() > 0.5 ? color : "#ffa95a",
        },
      });
    }

    setEffects((prev) => [...prev, ...newEffects]);

    setTimeout(() => {
      setEffects((prev) =>
        prev.filter((e) => !newEffects.some((ne) => ne.key === e.key))
      );
    }, 800);
  }, [color]);

  // --- NIBBLE VARIANT ---
  useEffect(() => {
    if (variant !== "nibble") return;

    let intervalDuration = 900;
    if (speed === "slow") intervalDuration = 1400;
    if (speed === "fast") intervalDuration = 450;

    const updateFace = (bite: number) => {
      const body = carrotBodyRef.current;
      if (!body) return;
      body.classList.remove(styles.worried, styles.shocked);
      if (bite === 1) body.classList.add(styles.worried);
      else if (bite === 3) body.classList.add(styles.shocked);
    };

    const takeBite = () => {
      const bites = bitesRef.current;
      const wrapper = carrotWrapperRef.current;
      const body = carrotBodyRef.current;
      const leavesEl = leavesRef.current;
      const shadow = floorShadowRef.current;

      if (!wrapper || !body || !leavesEl || !shadow) return;

      if (biteCount.current < bites.length) {
        bites[biteCount.current]?.classList.add(styles.biteActive);
        wrapper.classList.remove(styles.wobble);
        void wrapper.offsetWidth;
        wrapper.classList.add(styles.wobble);

        const spawnInfo = CRUMB_SPAWNS[biteCount.current];
        if (spawnInfo) triggerCrumbs(spawnInfo.left, spawnInfo.top);

        updateFace(biteCount.current + 1);

        if (biteCount.current === bites.length - 1) {
          leavesEl.style.opacity = "0";
          shadow.style.opacity = "0";
        }
        biteCount.current++;
      } else {
        biteCount.current = 0;
        bites.forEach((b) => b?.classList.remove(styles.biteActive));
        body.classList.remove(styles.worried, styles.shocked);
        leavesEl.style.opacity = "1";
        shadow.style.opacity = "1";
      }
    };

    const interval = setInterval(takeBite, intervalDuration);
    return () => clearInterval(interval);
  }, [speed, variant, triggerCrumbs]);

  // --- BUNNY VARIANT ---
  useEffect(() => {
    if (variant !== "bunny") return;

    let baseInterval = 1000;
    if (speed === "slow") baseInterval = 1500;
    if (speed === "fast") baseInterval = 600;

    const totalBites = 4;
    const crumbSpots = [
      { top: 130, left: 55 },
      { top: 110, left: 65 },
      { top: 90, left: 55 },
      { top: 70, left: 65 },
    ];

    // Positions the bunny climbs to for each bite
    const posNames = ["bunnyPos1", "bunnyPos2", "bunnyPos3", "bunnyPos4"];
    const faceStages: Array<"" | "worried" | "shocked"> = ["worried", "worried", "shocked", "shocked"];

    const runCycle = () => {
      const bc = bunnyBiteCount.current;

      if (bc < totalBites) {
        // Phase 1: Bunny rises, mouth opens (lunge)
        setBunnyPos(posNames[bc]);
        setBunnyEyeStyle("bEyeChomp");
        setBunnyMouthStyle("bMouthOpen");
        setBunnyCarrotFace(faceStages[bc]);

        // Phase 2: After a short beat, the bite lands
        setTimeout(() => {
          // Activate the bite overlay
          bunnyBitesRef.current[bc]?.classList.add(styles.bunnyBiteActive);

          // Wobble the carrot
          const carrotEl = bunnyCarrotRef.current;
          if (carrotEl) {
            carrotEl.classList.remove(styles.bunnyCarrotWobble);
            void carrotEl.offsetWidth;
            carrotEl.classList.add(styles.bunnyCarrotWobble);
          }

          // Crumbs fly
          triggerCrumbs(crumbSpots[bc].left, crumbSpots[bc].top);

          // Phase 3: Chewing
          setBunnyMouthStyle("bMouthChew");
          setBunnyEyeStyle("bEyeNormal");

          // If last bite, hide leaves
          if (bc === totalBites - 1 && bunnyLeavesRef.current) {
            bunnyLeavesRef.current.style.opacity = "0";
          }

          bunnyBiteCount.current++;
        }, baseInterval * 0.3);

      } else {
        // Bunny is happy!
        setBunnyPos("bunnyPosDone");
        setBunnyEyeStyle("bEyeHappy");
        setBunnyMouthStyle("bMouthHappy");
        setBunnyCheeksVisible(true);
        setBunnyCarrotFace("shocked");

        // Reset after a pause
        setTimeout(() => {
          bunnyBiteCount.current = 0;
          bunnyBitesRef.current.forEach((b) => b?.classList.remove(styles.bunnyBiteActive));
          setBunnyPos("bunnyPosIdle");
          setBunnyEyeStyle("bEyeNormal");
          setBunnyMouthStyle("bMouthNormal");
          setBunnyCheeksVisible(false);
          setBunnyCarrotFace("");
          if (bunnyLeavesRef.current) {
            bunnyLeavesRef.current.style.opacity = "1";
          }
        }, baseInterval * 1.2);
      }
    };

    const interval = setInterval(runCycle, baseInterval);
    return () => clearInterval(interval);
  }, [speed, variant, triggerCrumbs]);

  const scaleVal = typeof size === "number" ? size / 60 : 1;

  const customStyles: React.CSSProperties = {
    "--carrot-color": color,
    "--bite-color": biteColor,
    "--leaf-color": leafColor,
    transform: `scale(${scaleVal})`,
    transformOrigin: "center center",
    ...style,
  } as React.CSSProperties;

  return (
    <div
      className={`${styles.container} ${className}`}
      role="status"
      aria-label="Carrot loading animation"
      {...props}
    >
      <div className={styles.effectOverlay}>
        {effects.map((e) => (
          <div key={e.key} className={styles.crumb} style={e.style} />
        ))}
      </div>

      {variant === "nibble" ? (
        <>
          <div className={styles.floorShadow} ref={floorShadowRef} style={customStyles} />
          <div className={styles.floatWrapper} style={customStyles}>
            <div className={styles.carrotWrapper} ref={carrotWrapperRef}>
              <div className={styles.leaves} ref={leavesRef}>
                <div className={`${styles.leaf} ${styles.leafLeft}`} style={{ backgroundColor: leafColor }} />
                <div className={`${styles.leaf} ${styles.leafCenter}`} style={{ backgroundColor: leafColor }} />
                <div className={`${styles.leaf} ${styles.leafRight}`} style={{ backgroundColor: leafColor }} />
              </div>
              <div className={styles.carrotBody} ref={carrotBodyRef}>
                <div className={styles.face}>
                  <div className={styles.eyes}>
                    <div className={styles.eye} />
                    <div className={styles.eye} />
                  </div>
                  <div className={styles.mouth} />
                </div>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={`bite-${i}`}
                    className={`${styles.bite} ${styles[`bite${i + 1}`]}`}
                    ref={(el) => { bitesRef.current[i] = el; }}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ====== BUNNY VARIANT ====== */
        <div className={styles.bunnyScene} style={customStyles}>
          {/* The carrot (upright, with bite overlays) */}
          <div
            className={styles.bunnyCarrotWrap}
            ref={bunnyCarrotRef}
          >
            <div className={styles.leaves} ref={bunnyLeavesRef}>
              <div className={`${styles.leaf} ${styles.leafLeft}`} style={{ backgroundColor: leafColor }} />
              <div className={`${styles.leaf} ${styles.leafCenter}`} style={{ backgroundColor: leafColor }} />
              <div className={`${styles.leaf} ${styles.leafRight}`} style={{ backgroundColor: leafColor }} />
            </div>
            <div className={`${styles.bunnyCarrotBody} ${bunnyCarrotFace ? styles[bunnyCarrotFace] : ""}`}>
              <div className={styles.face}>
                <div className={styles.eyes}>
                  <div className={styles.eye} />
                  <div className={styles.eye} />
                </div>
                <div className={styles.mouth} />
              </div>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={`bb-${i}`}
                  className={`${styles.bunnyBite} ${styles[`bunnyBite${i + 1}`]}`}
                  ref={(el) => { bunnyBitesRef.current[i] = el; }}
                />
              ))}
            </div>
          </div>

          {/* The bunny character */}
          <div className={`${styles.bunny} ${styles[bunnyPos]}`}>
            <div className={styles.bunnyEars}>
              <div className={styles.earL} />
              <div className={styles.earR} />
            </div>
            <div className={styles.bunnyHead}>
              <div className={styles.bEyeWrap}>
                <div className={`${styles.bEye} ${styles[bunnyEyeStyle]}`} />
                <div className={`${styles.bEye} ${styles[bunnyEyeStyle]}`} />
              </div>
              <div className={`${styles.bMouth} ${styles[bunnyMouthStyle]}`} />
              <div className={styles.bCheeks}>
                <div className={`${styles.bCheek} ${bunnyCheeksVisible ? styles.bCheekVisible : ""}`} />
                <div className={`${styles.bCheek} ${bunnyCheeksVisible ? styles.bCheekVisible : ""}`} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrot;
