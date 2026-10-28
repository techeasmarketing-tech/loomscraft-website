"use client";
import { motion, useScroll, useSpring } from "framer-motion";

/** A thin gold "thread" along the top of the page that fills as you scroll. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />;
}
