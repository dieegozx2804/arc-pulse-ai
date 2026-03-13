import { motion } from "framer-motion";
import { vendedores } from "@/data/mockData";
import { Trophy, TrendingUp, Target, Ticket } from "lucide-react";

const TeamPanel = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full max-w-5xl mx-auto space-y-6"
  >
    <h2 className="text-sm tracking-[0.3em] text-primary/80" style={{ fontFamily: "Orbitron" }}>
      PERFORMANCE DA EQUIPE
    </h2>

    {/* Summary cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[
        { label: "Total Contratos", value: vendedores.reduce((a, v) => a + v.contratos, 0), icon: <Trophy size={16} /> },
        { label: "Conversão Média", value: `${(vendedores.reduce((a, v) => a + v.conversao, 0) / vendedores.length).toFixed(1)}%`, icon: <TrendingUp size={16} /> },
        { label: "Meta Média", value: `${((vendedores.reduce((a, v) => a + v.contratos, 0) / vendedores.reduce((a, v) => a + v.meta, 0)) * 100).toFixed(0)}%`, icon: <Target size={16} /> },
        { label: "Ticket Médio", value: `R$ ${(vendedores.reduce((a, v) => a + v.ticketMedio, 0) / vendedores.length).toFixed(0)}`, icon: <Ticket size={16} /> },
      ].map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card/60 border border-border rounded-xl p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            {s.icon}
            <span className="text-[0.6rem] tracking-wider uppercase">{s.label}</span>
          </div>
          <div className="text-xl font-bold text-foreground" style={{ fontFamily: "Orbitron" }}>{s.value}</div>
        </motion.div>
      ))}
    </div>

    {/* Ranking */}
    <div className="bg-card/40 border border-border rounded-xl p-5 backdrop-blur-sm">
      <h3 className="text-xs tracking-[0.2em] text-muted-foreground mb-4" style={{ fontFamily: "Orbitron" }}>
        RANKING DE VENDEDORES
      </h3>
      <div className="space-y-3">
        {vendedores.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-4 p-3 rounded-lg bg-muted/10 border border-border/30"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              i === 0 ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-muted/30 text-muted-foreground'
            }`} style={{ fontFamily: "Orbitron" }}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{v.nome}</p>
              <div className="flex gap-4 text-[0.65rem] text-muted-foreground mt-0.5">
                <span>{v.contratos}/{v.meta} contratos</span>
                <span>Conversão: {v.conversao}%</span>
                <span>Ticket: R$ {v.ticketMedio}</span>
              </div>
            </div>
            <div className="w-24">
              <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${(v.contratos / v.meta) * 100}%` }}
                  transition={{ delay: i * 0.08 + 0.3, duration: 0.6 }}
                />
              </div>
              <span className="text-[0.55rem] text-muted-foreground">{((v.contratos / v.meta) * 100).toFixed(0)}% meta</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default TeamPanel;
