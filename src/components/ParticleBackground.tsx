import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particles
    const particles: { x: number; y: number; vy: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vy: -(Math.random() * 0.5 + 0.1),
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.3 + 0.1,
      });
    }

    // Falling streaks (matrix-like)
    const streaks: { x: number; y: number; length: number; speed: number; alpha: number }[] = [];
    for (let i = 0; i < 15; i++) {
      streaks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 2 + 1,
        alpha: Math.random() * 0.15 + 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw streaks
      streaks.forEach(s => {
        const grad = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.length);
        grad.addColorStop(0, `hsla(152, 100%, 50%, ${s.alpha})`);
        grad.addColorStop(1, `hsla(152, 100%, 40%, 0)`);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x, s.y + s.length);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Bright head
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(152, 100%, 60%, ${s.alpha * 2})`;
        ctx.fill();

        s.y += s.speed;
        if (s.y > canvas.height) {
          s.y = -s.length;
          s.x = Math.random() * canvas.width;
        }
      });

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(152, 100%, 50%, ${p.alpha})`;
        ctx.fill();

        p.y += p.vy;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default ParticleBackground;
