import React from "react";
import styles from "./Spinner.module.css";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  color?: string;
  speed?: "slow" | "normal" | "fast";
  variant?: "classic" | "ring" | "dual" | "dashed";
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  color = "#3b82f6",
  speed = "normal",
  variant = "classic",
  className = "",
  style,
  ...props
}) => {
  const sizeVal = typeof size === "number" ? `${size}px` : size;

  // Custom styles for size and color
  const customStyles: React.CSSProperties = {
    "--spinner-size": sizeVal,
    "--spinner-color": color,
    ...style,
  } as React.CSSProperties;

  const speedClass = styles[speed] || styles.normal;
  const variantClass = styles[variant] || styles.classic;

  return (
    <div
      className={`${styles.container} ${speedClass} ${variantClass} ${className}`}
      style={customStyles}
      role="status"
      aria-label="Loading"
      {...props}
    >
      {variant === "classic" && (
        <svg
          viewBox="0 0 50 50"
          className={styles.svg}
          width="100%"
          height="100%"
        >
          <circle
            className={styles.circleBackground}
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
          />
          <circle
            className={styles.circleDash}
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
          />
        </svg>
      )}

      {variant === "ring" && (
        <div className={styles.ringTrack}>
          <div className={styles.ringLoader} />
        </div>
      )}

      {variant === "dual" && <div className={styles.dualLoader} />}

      {variant === "dashed" && <div className={styles.dashedLoader} />}
    </div>
  );
};

export default Spinner;
