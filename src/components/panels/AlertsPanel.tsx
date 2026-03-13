import { motion } from "framer-motion";
import { alertas } from "@/data/mockData";
import { AlertTriangle, Lightbulb, Info } from "lucide-react";

const iconMap = {
  oportunidade: <Lightbulb size={18} className="text-primary" />,
  risco: <AlertTriangle size={18} className="text-destructive" />,
  info: <Info size={18} className="text-muted-foreground" />,
};

const prioridadeColor = {
  alta: "border-primary/40 bg-primary/5",
  media: "border-border bg-card/50",
  baixa: "border-border/50 bg-card/30",
};

const AlertsPanel = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full max-w-3xl mx-auto space-y-6"
  >
    <h2 className="text-sm tracking-[0.3em] text-primary/80" style={{ fontFamily: "Orbitron" }}>
      ALERTAS ESTRATÉGICOS
    </h2>

    <div className="space-y-3">
      {alertas.map((a, i) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-start gap-4 p-4 rounded-xl border backdrop-blur-sm ${prioridadeColor[a.prioridade]}`}
        >
          <div className="mt-0.5">{iconMap[a.tipo]}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-foreground">{a.titulo}</p>
              <span className={`text-[0.5rem] tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                a.prioridade === 'alta' ? 'border-primary/40 text-primary' : 'border-border text-muted-foreground'
              }`}>
                {a.prioridade}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{a.descricao}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default AlertsPanel;
