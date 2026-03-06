import { motion } from "framer-motion";

interface UnimedLogoProps {
  isListening?: boolean;
  isProcessing?: boolean;
  size?: number;
}

const UnimedLogo = ({ isListening = false, isProcessing = false, size = 120 }: UnimedLogoProps) => {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      animate={{ scale: isListening ? 1.08 : isProcessing ? 1.04 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Outer ring pulse */}
      {(isListening || isProcessing) && (
        <motion.div
          className="absolute rounded-full border-2 border-primary/30"
          style={{ width: size + 20, height: size + 20 }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Main circle */}
      <div
        className={`rounded-full flex items-center justify-center shadow-lg transition-shadow duration-300 ${
          isListening ? 'unimed-pulse' : ''
        }`}
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, hsl(152 69% 38%), hsl(152 55% 48%))',
          boxShadow: isListening
            ? '0 8px 40px hsl(152 69% 38% / 0.5)'
            : isProcessing
            ? '0 6px 30px hsl(152 69% 38% / 0.35)'
            : '0 4px 20px hsl(152 69% 38% / 0.2)',
        }}
      >
        {/* Inner content - Unimed style cross/heart icon */}
        <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 60 60" fill="none">
          {/* Heart shape */}
          <path
            d="M30 52C30 52 8 38 8 22C8 14 14 8 22 8C26 8 29 10 30 12C31 10 34 8 38 8C46 8 52 14 52 22C52 38 30 52 30 52Z"
            fill="white"
            fillOpacity="0.95"
          />
          {/* Cross */}
          <rect x="26" y="18" width="8" height="24" rx="2" fill="hsl(152 69% 38%)" />
          <rect x="18" y="26" width="24" height="8" rx="2" fill="hsl(152 69% 38%)" />
        </svg>
      </div>

      {/* Status */}
      <div className="absolute" style={{ top: size + 8 }}>
        <span className="text-xs font-semibold tracking-wider uppercase text-primary/70">
          {isListening ? 'Ouvindo...' : isProcessing ? 'Pensando...' : 'Online'}
        </span>
      </div>
    </motion.div>
  );
};

export default UnimedLogo;
