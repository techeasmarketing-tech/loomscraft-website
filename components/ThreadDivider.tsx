"use client";
import { motion, useReducedMotion } from "framer-motion";

/** Gold needle-and-thread flourish that draws itself as it enters the screen. */
export default function ThreadDivider() {
  const reduce = useReducedMotion();
  return (
    <div className="thread" aria-hidden="true">
      <svg viewBox="0 0 600 40" preserveAspectRatio="xMidYMid meet">
        <motion.path
          d="M0 20 C 80 20, 110 4, 170 4 S 240 36, 300 20 S 400 4, 450 20 S 540 20, 600 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 2, ease: [0.2, 0.7, 0.1, 1] }}
        />
      </svg>
    </div>
  );
}
