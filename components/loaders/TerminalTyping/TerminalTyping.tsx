"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./TerminalTyping.module.css";

export interface TerminalTypingProps extends React.HTMLAttributes<HTMLDivElement> {
  progress?: number;
  speed?: "slow" | "normal" | "fast";
  interactive?: boolean;
  onProgressChange?: (progress: number) => void;
  command?: string;
}

const DEFAULT_COMMAND = "npm install...";

export const TerminalTyping: React.FC<TerminalTypingProps> = ({
  progress: customProgress,
  speed = "normal",
  interactive = true,
  onProgressChange,
  command = DEFAULT_COMMAND,
  className = "",
  style,
  ...props
}) => {
  const [internalProgress, setInternalProgress] = useState(0);
  const [typedCount, setTypedCount] = useState(0);

  const activeProgress = customProgress !== undefined ? customProgress : internalProgress;

  useEffect(() => {
    if (customProgress !== undefined) return;

    let step = 1.2;
    let intervalTime = 70;

    if (speed === "slow") {
      step = 0.6;
      intervalTime = 90;
    } else if (speed === "fast") {
      step = 2.2;
      intervalTime = 45;
    }

    const interval = setInterval(() => {
      setInternalProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          onProgressChange?.(0);
          setTypedCount(0);
          return 0;
        }
        onProgressChange?.(Math.round(next));
        return next;
      });

      setTypedCount((prev) => {
        if (prev >= command.length) return prev;
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [customProgress, speed, command.length, onProgressChange]);

  const handleReset = () => {
    if (!interactive) return;
    if (customProgress === undefined) {
      setInternalProgress(0);
      setTypedCount(0);
    }
    onProgressChange?.(0);
  };

  const bar = useMemo(() => {
    const blocks = 12;
    const filled = Math.min(blocks, Math.round((activeProgress / 100) * blocks));
    return `${"#".repeat(filled)}${"-".repeat(blocks - filled)}`;
  }, [activeProgress]);

  return (
    <div
      className={`${styles.container} ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(activeProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      onClick={handleReset}
      style={style}
      {...props}
    >
      <div className={styles.terminalHeader}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.title}>terminal</span>
      </div>
      <div className={styles.terminalBody}>
        <div className={styles.line}>
          <span className={styles.prompt}>$</span>
          <span>{command.slice(0, typedCount)}</span>
          <span className={styles.cursor} />
        </div>
        <div className={styles.progressLine}>
          <span className={styles.bar}>[{bar}]</span>
          <span className={styles.percent}>{Math.round(activeProgress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default TerminalTyping;
