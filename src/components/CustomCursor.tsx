"use client";

import { useState, useEffect, useRef } from "react";

export default function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const mousePosition = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const borderPos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const isVisible = useRef(false);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
        isVisible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (borderRef.current) borderRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeaveWindow = () => {
      isVisible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (borderRef.current) borderRef.current.style.opacity = "0";
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.closest("a, button, [role='button'], input, textarea, select, .interactive"))
      ) {
        isHovering.current = true;
      } else {
        isHovering.current = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeaveWindow);

    let animationId: number;

    const animate = () => {
      // Hardware-accelerated smooth Lerp interpolation
      dotPos.current.x += (mousePosition.current.x - dotPos.current.x) * 0.35;
      dotPos.current.y += (mousePosition.current.y - dotPos.current.y) * 0.35;

      borderPos.current.x += (mousePosition.current.x - borderPos.current.x) * 0.15;
      borderPos.current.y += (mousePosition.current.y - borderPos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (borderRef.current) {
        const scale = isHovering.current ? 1.6 : 1;
        borderRef.current.style.transform = `translate3d(${borderPos.current.x}px, ${borderPos.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        borderRef.current.style.borderColor = isHovering.current ? "rgba(201, 162, 74, 0.9)" : "rgba(255, 255, 255, 0.6)";
        borderRef.current.style.backgroundColor = isHovering.current ? "rgba(201, 162, 74, 0.15)" : "transparent";
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      cancelAnimationFrame(animationId);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Inner Gold Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-gvi-gold opacity-0 transition-opacity duration-300 pointer-events-none shadow-[0_0_8px_rgba(201,162,74,0.8)]"
        style={{ willChange: "transform" }}
      />
      {/* Outer Halo Ring */}
      <div
        ref={borderRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/60 opacity-0 transition-all duration-200 ease-out pointer-events-none"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
