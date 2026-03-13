import { motion } from "framer-motion";
import { funil } from "@/data/mockData";

const maxQtd = funil[0].quantidade;

const FunnelPanel = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full max-w-3xl mx-auto space-y-6"
  >
    <h2 className="text-sm tracking-[0.3em] text-primary/80" style={{ fontFamily: "Orbitron" }}>
      FUNIL COMERCIAL
    </h2>

    <div className="space-y-4">
      {funil.map((item, i) => {
        const widthPct = (item.quantidade / maxQtd) * 100;
        const convRate = i > 0 ? ((item.quantidade / funil[i - 1].quantidade) * 100).toFixed(1) : "100";
        return (
          <motion.div
            key={item.etapa}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="space-y-1"
          >
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground font-medium">{item.etapa}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-xs">{convRate}% conv.</span>
                <span className="text-primary font-bold" style={{ fontFamily: "Orbitron" }}>{item.quantidade}</span>
              </div>
            </div>
            <div className="h-8 rounded-lg bg-muted/20 overflow-hidden border border-border/30 flex items-center">
              <motion.div
                className="h-full rounded-lg flex items-center justify-end pr-3"
                style={{ background: item.cor }}
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ delay: i * 0.12 + 0.2, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>

    {/* Gargalo analysis */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="bg-card/40 border border-primary/20 rounded-xl p-4 backdrop-blur-sm"
    >
      <h3 className="text-xs tracking-[0.2em] text-primary/80 mb-2" style={{ fontFamily: "Orbitron" }}>
        ANÁLISE DE GARGALO
      </h3>
      <p className="text-sm text-foreground/80">
        O maior gargalo está na transição de <span className="text-primary font-semibold">Proposta Enviada → Negociação</span>,
        com apenas <span className="text-primary font-semibold">53%</span> de conversão.
        Recomenda-se revisão do processo de follow-up e treinamento da equipe nesta etapa.
      </p>
    </motion.div>
  </motion.div>
);

export default FunnelPanel;
