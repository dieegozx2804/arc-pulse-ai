import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { kpis, vendasMensais } from "@/data/mockData";
import { TrendingUp, Users, FileText, Target } from "lucide-react";

const kpiCards = [
  { label: "Contratos Ativos", value: kpis.contratosAtivos.toLocaleString(), icon: <FileText size={18} />, change: `+${kpis.crescimentoMensal}%` },
  { label: "Receita Mensal", value: kpis.receitaMensal, icon: <TrendingUp size={18} />, change: "+8.3%" },
  { label: "Leads do Mês", value: kpis.leadsMes, icon: <Users size={18} />, change: "+15%" },
  { label: "Meta Atingida", value: `${kpis.metaAtingida}%`, icon: <Target size={18} />, change: "" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const DashboardPanel = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full max-w-5xl mx-auto space-y-6"
  >
    <h2 className="text-sm tracking-[0.3em] text-primary/80" style={{ fontFamily: "Orbitron" }}>
      DASHBOARD COMERCIAL
    </h2>

    {/* KPI Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {kpiCards.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card/60 border border-border rounded-xl p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            {kpi.icon}
            <span className="text-[0.65rem] tracking-wider uppercase">{kpi.label}</span>
          </div>
          <div className="text-2xl font-bold text-foreground" style={{ fontFamily: "Orbitron" }}>
            {kpi.value}
          </div>
          {kpi.change && (
            <span className="text-xs text-primary">{kpi.change}</span>
          )}
        </motion.div>
      ))}
    </div>

    {/* Chart */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-card/40 border border-border rounded-xl p-5 backdrop-blur-sm"
    >
      <h3 className="text-xs tracking-[0.2em] text-muted-foreground mb-4" style={{ fontFamily: "Orbitron" }}>
        VENDAS MENSAIS
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={vendasMensais}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 50% 16%)" />
          <XAxis dataKey="mes" tick={{ fill: "hsl(150 30% 40%)", fontSize: 11 }} />
          <YAxis tick={{ fill: "hsl(150 30% 40%)", fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="pf" name="Pessoa Física" fill="hsl(152 100% 40%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pj" name="Pessoa Jurídica" fill="hsl(152 60% 25%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  </motion.div>
);

export default DashboardPanel;
