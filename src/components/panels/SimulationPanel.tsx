import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { kpis, previsao } from "@/data/mockData";

const SimulationPanel = () => {
  const [leadsIncrease, setLeadsIncrease] = useState(0);
  const [convIncrease, setConvIncrease] = useState(0);
  const [ticketIncrease, setTicketIncrease] = useState(0);

  const baseContratos = previsao.contratosPrevisto;
  const simContratos = Math.round(
    baseContratos * (1 + leadsIncrease / 100) * (1 + convIncrease / 100)
  );
  const simReceita = simContratos * kpis.ticketMedioGeral * (1 + ticketIncrease / 100);
  const impacto = ((simContratos - baseContratos) / baseContratos * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      <h2 className="text-sm tracking-[0.3em] text-primary/80" style={{ fontFamily: "Orbitron" }}>
        SIMULAÇÕES ESTRATÉGICAS
      </h2>

      <div className="space-y-6 bg-card/40 border border-border rounded-xl p-6 backdrop-blur-sm">
        {/* Leads slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Aumento de Leads</span>
            <span className="text-primary font-bold" style={{ fontFamily: "Orbitron" }}>+{leadsIncrease}%</span>
          </div>
          <Slider
            value={[leadsIncrease]}
            onValueChange={([v]) => setLeadsIncrease(v)}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Conversion slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Melhoria na Conversão</span>
            <span className="text-primary font-bold" style={{ fontFamily: "Orbitron" }}>+{convIncrease}%</span>
          </div>
          <Slider
            value={[convIncrease]}
            onValueChange={([v]) => setConvIncrease(v)}
            max={50}
            step={5}
            className="w-full"
          />
        </div>

        {/* Ticket slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Aumento no Ticket Médio</span>
            <span className="text-primary font-bold" style={{ fontFamily: "Orbitron" }}>+{ticketIncrease}%</span>
          </div>
          <Slider
            value={[ticketIncrease]}
            onValueChange={([v]) => setTicketIncrease(v)}
            max={50}
            step={5}
            className="w-full"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          key={simContratos}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-card/60 border border-border rounded-xl p-4 text-center backdrop-blur-sm"
        >
          <span className="text-[0.6rem] text-muted-foreground tracking-wider uppercase block mb-1">Contratos</span>
          <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "Orbitron" }}>{simContratos}</span>
        </motion.div>
        <motion.div
          key={simReceita}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-card/60 border border-border rounded-xl p-4 text-center backdrop-blur-sm"
        >
          <span className="text-[0.6rem] text-muted-foreground tracking-wider uppercase block mb-1">Receita</span>
          <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "Orbitron" }}>
            R$ {(simReceita / 1000000).toFixed(2)}M
          </span>
        </motion.div>
        <motion.div
          key={impacto}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className={`bg-card/60 border rounded-xl p-4 text-center backdrop-blur-sm ${
            Number(impacto) > 0 ? 'border-primary/30' : 'border-border'
          }`}
        >
          <span className="text-[0.6rem] text-muted-foreground tracking-wider uppercase block mb-1">Impacto</span>
          <span className={`text-2xl font-bold ${Number(impacto) > 0 ? 'text-primary' : 'text-foreground'}`} style={{ fontFamily: "Orbitron" }}>
            {Number(impacto) > 0 ? '+' : ''}{impacto}%
          </span>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-muted-foreground text-center"
      >
        Diga <span className="text-primary">"Jarvis, simule aumento de leads em 20%"</span> para simular por voz.
      </motion.p>
    </motion.div>
  );
};

export default SimulationPanel;
