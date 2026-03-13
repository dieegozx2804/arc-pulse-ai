import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface RadarNucleusProps {
  isListening?: boolean;
  isProcessing?: boolean;
  size?: number;
  onClick?: () => void;
}

const RadarNucleus = ({ isListening = false, isProcessing = false, size = 280, onClick }: RadarNucleusProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = size * 0.42;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const baseAlpha = isListening ? 0.6 : isProcessing ? 0.4 : 0.2;
      const sweepSpeed = isListening ? 0.02 : isProcessing ? 0.015 : 0.005;
      angleRef.current += sweepSpeed;

      // Concentric circles
      for (let i = 1; i <= 5; i++) {
        const r = (maxR / 5) * i;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(152, 100%, 40%, ${baseAlpha * 0.6})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Cross lines
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + maxR * Math.cos(a), cy + maxR * Math.sin(a));
        ctx.strokeStyle = `hsla(152, 100%, 40%, ${baseAlpha * 0.4})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Radar sweep
      const sweepAngle = angleRef.current;
      const gradient = ctx.createConicalGradient(sweepAngle, cx, cy);
      gradient.addColorStop(0, `hsla(152, 100%, 40%, ${baseAlpha * 1.5})`);
      gradient.addColorStop(0.15, `hsla(152, 100%, 40%, 0)`);
      gradient.addColorStop(1, `hsla(152, 100%, 40%, 0)`);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, sweepAngle - 0.8, sweepAngle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Sweep line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + maxR * Math.cos(sweepAngle), cy + maxR * Math.sin(sweepAngle));
      ctx.strokeStyle = `hsla(152, 100%, 50%, ${baseAlpha * 2})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Random dots (data points)
      if (isListening || isProcessing) {
        for (let i = 0; i < 6; i++) {
          const dotAngle = (sweepAngle - Math.random() * 1.5);
          const dotR = Math.random() * maxR * 0.8 + maxR * 0.1;
          const dotAlpha = Math.max(0, 1 - (sweepAngle - dotAngle) * 0.8);
          ctx.beginPath();
          ctx.arc(cx + dotR * Math.cos(dotAngle), cy + dotR * Math.sin(dotAngle), 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(152, 100%, 60%, ${dotAlpha * 0.8})`;
          ctx.fill();
        }
      }

      // Center core
      const coreR = size * 0.06;
      const coreGlow = isListening ? 0.9 : isProcessing ? 0.7 : 0.4;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.5);
      coreGrad.addColorStop(0, `hsla(152, 80%, 70%, ${coreGlow})`);
      coreGrad.addColorStop(0.4, `hsla(152, 100%, 40%, ${coreGlow * 0.6})`);
      coreGrad.addColorStop(1, `hsla(152, 100%, 40%, 0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(152, 80%, 55%, ${coreGlow})`;
      ctx.fill();

      // Horizontal scan line
      ctx.beginPath();
      ctx.moveTo(cx - maxR * 1.3, cy);
      ctx.lineTo(cx + maxR * 1.3, cy);
      ctx.strokeStyle = `hsla(152, 100%, 40%, ${baseAlpha * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Glow flares on horizontal line
      const flareGrad = ctx.createRadialGradient(cx - maxR, cy, 0, cx - maxR, cy, 8);
      flareGrad.addColorStop(0, `hsla(152, 100%, 60%, ${baseAlpha})`);
      flareGrad.addColorStop(1, `hsla(152, 100%, 40%, 0)`);
      ctx.beginPath();
      ctx.arc(cx - maxR, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = flareGrad;
      ctx.fill();

      const flareGrad2 = ctx.createRadialGradient(cx + maxR, cy, 0, cx + maxR, cy, 8);
      flareGrad2.addColorStop(0, `hsla(152, 100%, 60%, ${baseAlpha})`);
      flareGrad2.addColorStop(1, `hsla(152, 100%, 40%, 0)`);
      ctx.beginPath();
      ctx.arc(cx + maxR, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = flareGrad2;
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [size, isListening, isProcessing]);

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      animate={{ scale: isListening ? 1.05 : 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="rounded-full"
      />
      {/* Status label */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: -28 }}>
        <span
          className="text-[0.6rem] font-medium tracking-[0.3em] uppercase text-primary/60"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          {isListening ? 'ESCUTANDO' : isProcessing ? 'PROCESSANDO' : 'STANDBY'}
        </span>
      </div>
    </motion.div>
  );
};

export default RadarNucleus;
