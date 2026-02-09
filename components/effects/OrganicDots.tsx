"use client";

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  phase: number;
}

const DOT_COLOR_R = 45;
const DOT_COLOR_G = 90;
const DOT_COLOR_B = 61;
const NUM_DOTS = 140;
const INFLUENCE_RADIUS = 180;
const FLEE_STRENGTH = 0.45;
const RETURN_SPEED = 0.03;
const FLOAT_AMPLITUDE = 6;
const FLOAT_SPEED = 0.001;

export default function OrganicDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initDots = (w: number, h: number) => {
      const dots: Dot[] = [];
      for (let i = 0; i < NUM_DOTS; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        dots.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: 2.5 + Math.random() * 3.5,
          opacity: 0.08 + Math.random() * 0.14,
          phase: Math.random() * Math.PI * 2,
        });
      }
      dotsRef.current = dots;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initDots(w, h);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const animate = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const { x: mx, y: my } = mouseRef.current;
      const dots = dotsRef.current;
      timeRef.current++;
      const time = timeRef.current;

      for (const dot of dots) {
        // Floating movement
        const floatX = Math.sin(time * FLOAT_SPEED + dot.phase) * FLOAT_AMPLITUDE;
        const floatY = Math.cos(time * FLOAT_SPEED + dot.phase * 1.3) * FLOAT_AMPLITUDE;

        const targetX = dot.baseX + floatX;
        const targetY = dot.baseY + floatY;

        // Flee from cursor
        const dx = dot.x - mx;
        const dy = dot.y - my;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < INFLUENCE_RADIUS && distance > 0) {
          const force = (1 - distance / INFLUENCE_RADIUS) * FLEE_STRENGTH;
          const angle = Math.atan2(dy, dx);
          dot.x += Math.cos(angle) * force * INFLUENCE_RADIUS * 0.05;
          dot.y += Math.sin(angle) * force * INFLUENCE_RADIUS * 0.05;
        }

        // Return to base + float
        dot.x += (targetX - dot.x) * RETURN_SPEED;
        dot.y += (targetY - dot.y) * RETURN_SPEED;

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${DOT_COLOR_R}, ${DOT_COLOR_G}, ${DOT_COLOR_B}, ${dot.opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10"
    />
  );
}
