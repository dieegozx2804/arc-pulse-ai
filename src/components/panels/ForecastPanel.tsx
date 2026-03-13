import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { vendasMensais, previsao } from "@/data/mockData";
import { TrendingUp, Target, BarChart3, ShieldCheck } from "lucide-react";

const projectedData = vendasMensais.map((v, i) => ({
  ...v,
  projecao: i >= 9 ? Math.round(v.total * 1.12) : undefined,
}));

const ForecastPanel = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full max-w-5xl mx-auto space-y-6"
  >
    <h2 className="text-sm tracking-[0.3em] text-primary/80" style={{ fontFamily: "Orbitron" }}>
      PREVISÃO DE VENDAS
    </h2>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[
        { label: "Contratos Previsto", value: previsao.contratosPrevisto, icon: <Target size={16} /> },
        { label: "Receita Prevista", value: previsao.receitaPrevista, icon: <TrendingUp size={16} /> },
        { label: "Tendência", value: "Crescimento", icon: <BarChart3 size={16} /> },
        { label: "Confiança", value: `${previsao.confianca}%`, icon: <ShieldCheck size={16} /> },
      ].map((k, i) => (
        <motion.div
          key={k.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card/60 border border-border rounded-xl p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            {k.icon}
            <span className="text-[0.6rem] tracking-wider uppercase">{k.label}</span>
          </div>
          <div className="text-xl font-bold text-foreground" style={{ fontFamily: "Orbitron" }}>{k.value}</div>
        </motion.div>
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-card/40 border border-border rounded-xl p-5 backdrop-blur-sm"
    >
      <h3 className="text-xs tracking-[0.2em] text-muted-foreground mb-4" style={{ fontFamily: "Orbitron" }}>
        TENDÊNCIA ANUAL
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={projectedData}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(152 100% 40%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(152 100% 40%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 50% 16%)" />
          <XAxis dataKey="mes" tick={{ fill: "hsl(150 30% 40%)", fontSize: 11 }} />
          <YAxis tick={{ fill: "hsl(150 30% 40%)", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "hsl(150 25% 7%)", border: "1px solid hsl(150 50% 16%)", borderRadius: 8, fontSize: 12 }} />
          <Area type="monotone" dataKey="total" stroke="hsl(152 100% 40%)" fill="url(#colorTotal)" strokeWidth={2} name="Vendas" />
          <Line type="monotone" dataKey="projecao" stroke="hsl(152 60% 60%)" strokeDasharray="5 5" strokeWidth={2} name="Projeção" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  </motion.div>
);

export default ForecastPanel;
