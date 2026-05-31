import React from "react";
import styles from "./Skeleton.module.css";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  variant?: "text" | "rect" | "circle" | "card";
  animate?: "shimmer" | "pulse" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = "text",
  animate = "shimmer",
  className = "",
  style,
  ...props
}) => {
  const getStyles = (): React.CSSProperties => {
    const customStyle: React.CSSProperties = { ...style };

    if (width !== undefined) {
      customStyle.width = typeof width === "number" ? `${width}px` : width;
    }
    if (height !== undefined) {
      customStyle.height = typeof height === "number" ? `${height}px` : height;
    }

    return customStyle;
  };

  const animClass = styles[animate] || styles.none;
  const variantClass = styles[variant] || styles.text;

  // Let's create a visual card skeleton if the variant is card
  if (variant === "card") {
    return (
      <div
        className={`${styles.cardContainer} ${className}`}
        style={getStyles()}
        role="status"
        aria-label="Loading placeholder"
        {...props}
      >
        <div className={`${styles.cardMedia} ${animClass}`} />
        <div className={styles.cardContent}>
          <div className={`${styles.cardAvatar} ${animClass}`} />
          <div className={styles.cardTextLines}>
            <div className={`${styles.cardTitle} ${animClass}`} />
            <div className={`${styles.cardSub} ${animClass}`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.skeleton} ${variantClass} ${animClass} ${className}`}
      style={getStyles()}
      role="status"
      aria-label="Loading placeholder"
      {...props}
    />
  );
};

export default Skeleton;
