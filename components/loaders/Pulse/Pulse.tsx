import React from "react";
import styles from "./Pulse.module.css";

export interface PulseProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  color?: string;
  speed?: "slow" | "normal" | "fast";
  variant?: "circle" | "ripple" | "double";
}

export const Pulse: React.FC<PulseProps> = ({
  size = 40,
  color = "#3b82f6",
  speed = "normal",
  variant = "circle",
  className = "",
  style,
  ...props
}) => {
  const sizeVal = typeof size === "number" ? `${size}px` : size;

  const customStyles: React.CSSProperties = {
    "--pulse-size": sizeVal,
    "--pulse-color": color,
    ...style,
  } as React.CSSProperties;

  const speedClass = styles[speed] || styles.normal;
  const variantClass = styles[variant] || styles.circle;

  return (
    <div
      className={`${styles.container} ${speedClass} ${variantClass} ${className}`}
      style={customStyles}
      role="status"
      aria-label="Loading"
      {...props}
    >
      {variant === "circle" && <div className={styles.circleElement} />}
      
      {variant === "ripple" && (
        <>
          <div className={`${styles.rippleElement} ${styles.ripple1}`} />
          <div className={`${styles.rippleElement} ${styles.ripple2}`} />
          <div className={`${styles.rippleElement} ${styles.ripple3}`} />
        </>
      )}

      {variant === "double" && (
        <>
          <div className={`${styles.doubleElement} ${styles.double1}`} />
          <div className={`${styles.doubleElement} ${styles.double2}`} />
        </>
      )}
    </div>
  );
};

export default Pulse;
