import { motion } from "framer-motion";

interface ArcReactorProps {
  isListening?: boolean;
  isProcessing?: boolean;
  size?: number;
}

const ArcReactor = ({ isListening = false, isProcessing = false, size = 200 }: ArcReactorProps) => {
  const scale = isListening ? 1.1 : isProcessing ? 1.05 : 1;
  const glowIntensity = isListening ? 0.8 : isProcessing ? 0.6 : 0.3;

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      animate={{ scale }}
      transition={{ duration: 0.3 }}
    >
      {/* Outer glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, hsl(190 100% 50% / ${glowIntensity}) 0%, transparent 70%)`,
        }}
      />

      {/* Outer ring */}
      <svg
        className="absolute reactor-ring"
        width={size}
        height={size}
        viewBox="0 0 200 200"
      >
        <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(190 100% 50% / 0.2)" strokeWidth="1" />
        <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(190 100% 50% / 0.6)" strokeWidth="1.5"
          strokeDasharray="20 10 5 10" />
        {/* Tick marks */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const inner = 82;
          const outer = i % 3 === 0 ? 92 : 87;
          return (
            <line
              key={i}
              x1={100 + inner * Math.cos(angle)}
              y1={100 + inner * Math.sin(angle)}
              x2={100 + outer * Math.cos(angle)}
              y2={100 + outer * Math.sin(angle)}
              stroke={`hsl(190 100% 50% / ${i % 3 === 0 ? 0.6 : 0.2})`}
              strokeWidth={i % 3 === 0 ? 1.5 : 0.5}
            />
          );
        })}
      </svg>

      {/* Middle ring */}
      <svg
        className="absolute reactor-ring-reverse"
        width={size * 0.7}
        height={size * 0.7}
        viewBox="0 0 140 140"
      >
        <circle cx="70" cy="70" r="60" fill="none" stroke="hsl(190 100% 50% / 0.3)" strokeWidth="1"
          strokeDasharray="8 4 2 4" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={70 + 50 * Math.cos(angle)}
              y1={70 + 50 * Math.sin(angle)}
              x2={70 + 62 * Math.cos(angle)}
              y2={70 + 62 * Math.sin(angle)}
              stroke="hsl(190 100% 50% / 0.5)"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {/* Inner ring with triangle segments */}
      <svg
        className="absolute reactor-ring"
        width={size * 0.45}
        height={size * 0.45}
        viewBox="0 0 90 90"
        style={{ animationDuration: '12s' }}
      >
        <circle cx="45" cy="45" r="38" fill="none" stroke="hsl(190 100% 50% / 0.4)" strokeWidth="1.5"
          strokeDasharray="15 8" />
      </svg>

      {/* Core */}
      <motion.div
        className="absolute rounded-full reactor-pulse"
        style={{
          width: size * 0.18,
          height: size * 0.18,
          background: 'radial-gradient(circle, hsl(190 100% 85%) 0%, hsl(190 100% 50%) 50%, hsl(210 100% 40%) 100%)',
          boxShadow: `0 0 ${20 + glowIntensity * 30}px hsl(190 100% 50% / ${glowIntensity}), 0 0 ${40 + glowIntensity * 40}px hsl(190 100% 50% / ${glowIntensity * 0.5})`,
        }}
        animate={{
          boxShadow: isListening
            ? [
                `0 0 30px hsl(190 100% 50% / 0.8), 0 0 60px hsl(190 100% 50% / 0.4)`,
                `0 0 50px hsl(190 100% 50% / 1), 0 0 100px hsl(190 100% 50% / 0.6)`,
                `0 0 30px hsl(190 100% 50% / 0.8), 0 0 60px hsl(190 100% 50% / 0.4)`,
              ]
            : undefined,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Status text */}
      <div className="absolute" style={{ top: size * 0.85 }}>
        <span className="text-xs font-medium tracking-[0.3em] uppercase text-primary/70"
          style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.6rem' }}>
          {isListening ? 'LISTENING' : isProcessing ? 'PROCESSING' : 'STANDBY'}
        </span>
      </div>
    </motion.div>
  );
};

export default ArcReactor;
