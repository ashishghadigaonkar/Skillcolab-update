import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  shape: "circle" | "rect" | "triangle";
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  fadeSpeed: number;
}

const THEME_COLORS = [
  "#6366f1", // indigo-500
  "#818cf8", // indigo-400
  "#f97316", // orange-500
  "#fb923c", // orange-400
  "#10b981", // emerald-500
  "#34d399", // emerald-400
  "#ec4899", // pink-500
  "#f472b6", // pink-400
  "#3b82f6", // blue-500
];

export function ConfettiOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const updateAndRender = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // Gravity
        p.vx *= 0.98; // Air resistance
        p.rotation += p.rotationSpeed;
        p.opacity -= p.fadeSpeed;

        if (p.opacity <= 0 || p.y > canvas.height + p.size) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        ctx.beginPath();
        if (p.shape === "circle") {
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        } else if (p.shape === "triangle") {
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
        } else {
          ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.fill();
        ctx.restore();
      }

      if (particles.length > 0) {
        animationFrameRef.current = requestAnimationFrame(updateAndRender);
      } else {
        animationFrameRef.current = null;
      }
    };

    const triggerConfetti = (e: Event) => {
      const customEvent = e as CustomEvent;
      const origin = customEvent.detail?.origin || "center";
      const count = customEvent.detail?.count || 85;

      const newParticles: Particle[] = [];
      const colors = customEvent.detail?.colors || THEME_COLORS;

      for (let i = 0; i < count; i++) {
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        let vx = (Math.random() - 0.5) * 15;
        let vy = -5 - Math.random() * 12;

        if (origin === "sides") {
          // Explode from corners
          const isLeft = Math.random() > 0.5;
          x = isLeft ? 20 : canvas.width - 20;
          y = canvas.height * 0.75;
          vx = isLeft ? (5 + Math.random() * 10) : (-5 - Math.random() * 10);
          vy = -12 - Math.random() * 12;
        } else if (origin === "top") {
          // Rain from top
          x = Math.random() * canvas.width;
          y = -20;
          vx = (Math.random() - 0.5) * 4;
          vy = 1 + Math.random() * 4;
        } else {
          // Center explosion (raised up)
          x = canvas.width / 2;
          y = canvas.height * 0.45;
          vx = (Math.random() - 0.5) * 18;
          vy = -8 - Math.random() * 10;
        }

        newParticles.push({
          x,
          y,
          size: 6 + Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: ["rect", "circle", "triangle"][Math.floor(Math.random() * 3)] as any,
          vx,
          vy,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          opacity: 1,
          fadeSpeed: 0.005 + Math.random() * 0.012,
        });
      }

      particlesRef.current = [...particlesRef.current, ...newParticles];

      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateAndRender);
      }
    };

    window.addEventListener("trigger-confetti", triggerConfetti);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("trigger-confetti", triggerConfetti);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999] w-full h-full"
    />
  );
}

// Global utility helper to trigger matching celebration easily
export function celebrateMatch(origin: "center" | "sides" | "top" = "sides") {
  window.dispatchEvent(
    new CustomEvent("trigger-confetti", {
      detail: { origin, count: origin === "sides" ? 110 : 85 },
    })
  );
}
