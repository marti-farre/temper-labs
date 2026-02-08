"use client";

import { useEffect, useRef } from "react";

interface GridPoint {
  originX: number;
  originY: number;
  x: number;
  y: number;
}

const SPACING = 60;
const INFLUENCE_RADIUS = 220;
const STRENGTH = 0.45;
const EASE_BACK = 0.12;

export default function GravityGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const gridRef = useRef<GridPoint[][]>([]);
  const rafRef = useRef<number>(0);
  const colsRef = useRef(0);
  const rowsRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initGrid = (w: number, h: number) => {
      const cols = Math.ceil(w / SPACING) + 2;
      const rows = Math.ceil(h / SPACING) + 2;
      const offsetX = (w - (cols - 1) * SPACING) / 2;
      const offsetY = (h - (rows - 1) * SPACING) / 2;
      const grid: GridPoint[][] = [];
      for (let row = 0; row < rows; row++) {
        const rowArr: GridPoint[] = [];
        for (let col = 0; col < cols; col++) {
          const x = offsetX + col * SPACING;
          const y = offsetY + row * SPACING;
          rowArr.push({ originX: x, originY: y, x, y });
        }
        grid.push(rowArr);
      }
      gridRef.current = grid;
      colsRef.current = cols;
      rowsRef.current = rows;
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
      initGrid(w, h);
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
      const grid = gridRef.current;
      const rows = rowsRef.current;
      const cols = colsRef.current;

      // Update positions
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pt = grid[r][c];
          const dx = mx - pt.originX;
          const dy = my - pt.originY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let targetX = pt.originX;
          let targetY = pt.originY;

          if (dist < INFLUENCE_RADIUS) {
            const force = (1 - dist / INFLUENCE_RADIUS) * STRENGTH;
            targetX = pt.originX + dx * force;
            targetY = pt.originY + dy * force;
          }

          pt.x += (targetX - pt.x) * EASE_BACK;
          pt.y += (targetY - pt.y) * EASE_BACK;
        }
      }

      // Draw lines
      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pt = grid[r][c];
          const midX = (pt.x + pt.originX) / 2;
          const midY = (pt.y + pt.originY) / 2;
          const distPt = Math.sqrt((mx - midX) ** 2 + (my - midY) ** 2);
          const proximity = Math.max(0, 1 - distPt / INFLUENCE_RADIUS);

          // Horizontal line to right neighbor
          if (c < cols - 1) {
            const right = grid[r][c + 1];
            const distR = Math.sqrt((mx - right.x) ** 2 + (my - right.y) ** 2);
            const proxR = Math.max(0, 1 - distR / INFLUENCE_RADIUS);
            const avgProx = (proximity + proxR) / 2;

            if (avgProx > 0.05) {
              const red = Math.round(42 + (45 - 42) * avgProx);
              const green = Math.round(42 + (212 - 42) * avgProx);
              const blue = Math.round(50 + (191 - 50) * avgProx);
              const alpha = 0.4 + avgProx * 0.5;
              ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
            } else {
              ctx.strokeStyle = "rgba(42, 42, 50, 0.4)";
            }
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(right.x, right.y);
            ctx.stroke();
          }

          // Vertical line to bottom neighbor
          if (r < rows - 1) {
            const bottom = grid[r + 1][c];
            const distB = Math.sqrt((mx - bottom.x) ** 2 + (my - bottom.y) ** 2);
            const proxB = Math.max(0, 1 - distB / INFLUENCE_RADIUS);
            const avgProx = (proximity + proxB) / 2;

            if (avgProx > 0.05) {
              const red = Math.round(42 + (45 - 42) * avgProx);
              const green = Math.round(42 + (212 - 42) * avgProx);
              const blue = Math.round(50 + (191 - 50) * avgProx);
              const alpha = 0.4 + avgProx * 0.5;
              ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
            } else {
              ctx.strokeStyle = "rgba(42, 42, 50, 0.4)";
            }
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(bottom.x, bottom.y);
            ctx.stroke();
          }
        }
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
