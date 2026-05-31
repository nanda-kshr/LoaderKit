import React from "react";
import styles from "./Wave.module.css";

export interface WaveProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  color?: string;
  speed?: "slow" | "normal" | "fast";
  variant?: "bars" | "fluid" | "pulse-wave";
  count?: number;
}

export const Wave: React.FC<WaveProps> = ({
  size = 40,
  color = "#3b82f6",
  speed = "normal",
  variant = "bars",
  count = 5,
  className = "",
  style,
  ...props
}) => {
  const containerSize = typeof size === "number" ? `${size}px` : size;
  
  // Constrain count between 4 and 8 for best visual flow
  const waveCount = Math.max(4, Math.min(8, count));

  const customStyles: React.CSSProperties = {
    "--wave-size": containerSize,
    "--wave-color": color,
    ...style,
  } as React.CSSProperties;

  const speedClass = styles[speed] || styles.normal;
  const variantClass = styles[variant] || styles.bars;

  return (
    <div
      className={`${styles.container} ${speedClass} ${variantClass} ${className}`}
      style={customStyles}
      role="status"
      aria-label="Loading"
      {...props}
    >
      {variant === "bars" &&
        Array.from({ length: waveCount }).map((_, i) => (
          <div
            key={i}
            className={styles.bar}
            style={{
              animationDelay: `calc(var(--wave-delay, 0.12s) * ${i})`,
            }}
          />
        ))}

      {variant === "fluid" &&
        Array.from({ length: waveCount }).map((_, i) => (
          <div
            key={i}
            className={styles.fluidDot}
            style={{
              animationDelay: `calc(var(--wave-delay, 0.15s) * ${i})`,
            }}
          />
        ))}

      {variant === "pulse-wave" && (
        <>
          <div className={`${styles.pulseRing} ${styles.ring1}`} />
          <div className={`${styles.pulseRing} ${styles.ring2}`} />
          <div className={`${styles.pulseRing} ${styles.ring3}`} />
        </>
      )}
    </div>
  );
};

export default Wave;
