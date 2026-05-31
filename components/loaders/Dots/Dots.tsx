import React from "react";
import styles from "./Dots.module.css";

export interface DotsProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  color?: string;
  speed?: "slow" | "normal" | "fast";
  variant?: "bouncing" | "flashing" | "chase";
  count?: number;
}

export const Dots: React.FC<DotsProps> = ({
  size = 10,
  color = "#3b82f6",
  speed = "normal",
  variant = "bouncing",
  count = 3,
  className = "",
  style,
  ...props
}) => {
  const dotSize = typeof size === "number" ? `${size}px` : size;
  
  // Constrain count between 3 and 5 for best visuals
  const dotCount = Math.max(3, Math.min(5, count));

  const customStyles: React.CSSProperties = {
    "--dot-size": dotSize,
    "--dot-color": color,
    ...style,
  } as React.CSSProperties;

  const speedClass = styles[speed] || styles.normal;
  const variantClass = styles[variant] || styles.bouncing;

  return (
    <div
      className={`${styles.container} ${speedClass} ${variantClass} ${className}`}
      style={customStyles}
      role="status"
      aria-label="Loading"
      {...props}
    >
      {Array.from({ length: dotCount }).map((_, i) => (
        <div
          key={i}
          className={styles.dot}
          style={{
            animationDelay: `calc(var(--dot-delay, 0.16s) * ${i})`,
          }}
        />
      ))}
    </div>
  );
};

export default Dots;
