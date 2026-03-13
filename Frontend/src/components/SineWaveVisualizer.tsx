import { useRef, useEffect, useCallback } from "react";

interface SineWaveVisualizerProps {
  /** Normalized mouse X position (0–1) within the container */
  mouseX: number;
  /** Normalized mouse Y position (0–1) within the container */
  mouseY: number;
  /** CSS class for the canvas wrapper */
  className?: string;
}

// ── Theme colors (HSL values from the design system) ──
const PRIMARY = { h: 16, s: 90, l: 58 }; // warm orange
const ACCENT = { h: 174, s: 72, l: 46 }; // teal
const PURPLE = { h: 260, s: 60, l: 55 }; // purple accent

function hsl(h: number, s: number, l: number, a = 1) {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

interface WaveConfig {
  amplitude: number;
  frequency: number;
  speed: number;
  color: { h: number; s: number; l: number };
  alpha: number;
  lineWidth: number;
  phaseOffset: number;
  yOffsetRatio: number; // 0 = center, negative = up, positive = down
}

const WAVE_CONFIGS: WaveConfig[] = [
  // Primary sweeping wave — large & slow
  { amplitude: 50, frequency: 0.008, speed: 0.015, color: PRIMARY, alpha: 0.5, lineWidth: 2.5, phaseOffset: 0, yOffsetRatio: -0.05 },
  // Accent wave — mid-range
  { amplitude: 35, frequency: 0.012, speed: 0.022, color: ACCENT, alpha: 0.4, lineWidth: 2, phaseOffset: 1.2, yOffsetRatio: 0.05 },
  // Purple ghost wave
  { amplitude: 25, frequency: 0.015, speed: 0.018, color: PURPLE, alpha: 0.25, lineWidth: 1.5, phaseOffset: 2.4, yOffsetRatio: 0.12 },
  // Primary harmonic (thinner, faster)
  { amplitude: 18, frequency: 0.02, speed: 0.03, color: PRIMARY, alpha: 0.2, lineWidth: 1, phaseOffset: 3.6, yOffsetRatio: -0.1 },
  // Accent harmonic
  { amplitude: 15, frequency: 0.025, speed: 0.028, color: ACCENT, alpha: 0.18, lineWidth: 1, phaseOffset: 4.8, yOffsetRatio: 0.15 },
  // Very subtle background rhythm
  { amplitude: 40, frequency: 0.006, speed: 0.01, color: PRIMARY, alpha: 0.08, lineWidth: 3, phaseOffset: 6.0, yOffsetRatio: 0 },
];

const SineWaveVisualizer = ({ mouseX, mouseY, className }: SineWaveVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // Smoothly interpolate mouse for buttery transitions
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  const drawWave = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      config: WaveConfig,
      time: number,
      mx: number,
      my: number
    ) => {
      const centerY = height * 0.5 + height * config.yOffsetRatio;

      // Mouse influence: amplitude boost near cursor, frequency warp
      const mouseInfluence = 1 + (my - 0.5) * 0.6; // vertical mouse affects amplitude
      const freqWarp = 1 + (mx - 0.5) * 0.3; // horizontal mouse affects frequency

      const amp = config.amplitude * mouseInfluence;
      const freq = config.frequency * freqWarp;
      const phase = time * config.speed + config.phaseOffset;

      ctx.beginPath();
      ctx.strokeStyle = hsl(config.color.h, config.color.s, config.color.l, config.alpha);
      ctx.lineWidth = config.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Draw the sine wave
      for (let x = 0; x <= width; x += 2) {
        const normalizedX = x / width;

        // Create a compound wave for organic movement
        const y =
          centerY +
          Math.sin(x * freq + phase) * amp +
          Math.sin(x * freq * 2.3 + phase * 1.7) * (amp * 0.25) +
          Math.sin(x * freq * 0.7 + phase * 0.5) * (amp * 0.15);

        // Fade edges for a clean look
        const edgeFade = Math.sin(normalizedX * Math.PI);
        const fadedY = centerY + (y - centerY) * edgeFade;

        if (x === 0) {
          ctx.moveTo(x, fadedY);
        } else {
          ctx.lineTo(x, fadedY);
        }
      }

      ctx.stroke();

      // Optional: draw a subtle glow version underneath
      if (config.alpha > 0.15) {
        ctx.beginPath();
        ctx.strokeStyle = hsl(config.color.h, config.color.s, config.color.l + 15, config.alpha * 0.3);
        ctx.lineWidth = config.lineWidth + 6;
        ctx.filter = "blur(8px)";

        for (let x = 0; x <= width; x += 4) {
          const normalizedX = x / width;
          const y =
            centerY +
            Math.sin(x * freq + phase) * amp +
            Math.sin(x * freq * 2.3 + phase * 1.7) * (amp * 0.25) +
            Math.sin(x * freq * 0.7 + phase * 0.5) * (amp * 0.15);
          const edgeFade = Math.sin(normalizedX * Math.PI);
          const fadedY = centerY + (y - centerY) * edgeFade;

          if (x === 0) {
            ctx.moveTo(x, fadedY);
          } else {
            ctx.lineTo(x, fadedY);
          }
        }
        ctx.stroke();
        ctx.filter = "none";
      }
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Smoothly lerp mouse position
      const lerp = 0.06;
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * lerp;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * lerp;

      const mx = smoothMouseRef.current.x;
      const my = smoothMouseRef.current.y;

      timeRef.current += 1;

      // Clear with transparent (let CSS background show through)
      ctx.clearRect(0, 0, width, height);

      // Draw each wave layer
      for (const config of WAVE_CONFIGS) {
        drawWave(ctx, width, height, config, timeRef.current, mx, my);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [drawWave]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};

export default SineWaveVisualizer;
