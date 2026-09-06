"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const RISE_DELAYS = [0.05, 0.16, 0.27, 0.38, 0.5, 0.62];

type RiseProps = {
  delay?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: ReactNode;
};

export function Rise({ delay = 1, className, children }: RiseProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        delay: RISE_DELAYS[delay - 1],
        ease: [0.2, 0.75, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

type RevealProps = {
  delay?: number;
  className?: string;
  children: ReactNode;
};

export function Reveal({ delay = 0, className, children }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: 0.7,
        delay: delay / 1000,
        ease: [0.2, 0.7, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
