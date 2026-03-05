import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, HardDrive, Wifi, WifiOff } from "lucide-react";

const HudWidget = () => {
  const [time, setTime] = useState(new Date());
  const [online, setOnline] = useState(navigator.onLine);
  const [cpuSim, setCpuSim] = useState(23);
  const [ramSim, setRamSim] = useState(41);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const c = setInterval(() => {
      setCpuSim(Math.floor(15 + Math.random() * 35));
      setRamSim(Math.floor(35 + Math.random() * 25));
    }, 2000);
    const onlineHandler = () => setOnline(true);
    const offlineHandler = () => setOnline(false);
    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);
    return () => {
      clearInterval(t);
      clearInterval(c);
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }, []);

  const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour12: false });
  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-3 text-xs"
      style={{ fontFamily: 'Orbitron, sans-serif' }}
    >
      {/* Time */}
      <div className="border border-border rounded-md p-3 bg-card/50 backdrop-blur-sm">
        <div className="text-primary text-lg tracking-widest text-glow">{formatTime(time)}</div>
        <div className="text-muted-foreground text-[0.6rem] tracking-[0.2em]">{formatDate(time)}</div>
      </div>

      {/* System Stats */}
      <div className="border border-border rounded-md p-3 bg-card/50 backdrop-blur-sm space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Cpu size={12} className="text-primary" />
          <span className="flex-1">CPU</span>
          <span className="text-primary">{cpuSim}%</span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${cpuSim}%` }} transition={{ duration: 0.5 }} />
        </div>

        <div className="flex items-center gap-2 text-muted-foreground mt-2">
          <HardDrive size={12} className="text-primary" />
          <span className="flex-1">RAM</span>
          <span className="text-primary">{ramSim}%</span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-accent rounded-full" animate={{ width: `${ramSim}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      {/* Connection Status */}
      <div className="border border-border rounded-md p-3 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {online ? <Wifi size={12} className="text-green-400" /> : <WifiOff size={12} className="text-destructive" />}
          <span className="text-muted-foreground">{online ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
        <div className="text-[0.55rem] text-muted-foreground mt-1 tracking-wider">
          MODE: {online ? 'CLOUD' : 'LOCAL'}
        </div>
      </div>
    </motion.div>
  );
};

export default HudWidget;
