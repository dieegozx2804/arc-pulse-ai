import { motion } from "framer-motion";

interface VoiceWaveformProps {
  isActive: boolean;
  barCount?: number;
}

const VoiceWaveform = ({ isActive, barCount = 32 }: VoiceWaveformProps) => {
  return (
    <div className="flex items-center justify-center gap-[2px] h-8">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full bg-primary"
          animate={{
            height: isActive ? [4, Math.random() * 28 + 4, 4] : 4,
            opacity: isActive ? [0.4, 1, 0.4] : 0.2,
          }}
          transition={{
            duration: 0.4 + Math.random() * 0.4,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.02,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;
