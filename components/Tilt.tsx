"use client";
import { useRef, ReactNode } from "react";
export default function Tilt({
  children,
  max = 7,
}: {
  children: ReactNode;
  max?: number;
}) {
  const r = useRef<HTMLDivElement>(null);
  const mv = (e: React.MouseEvent) => {
    const el = r.current!;
    const b = el.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5,
      y = (e.clientY - b.top) / b.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg)`;
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
  };
  const lv = () => {
    r.current!.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  };
  return (
    <div ref={r} className="tilt" onMouseMove={mv} onMouseLeave={lv}>
      {children}
    </div>
  );
}
