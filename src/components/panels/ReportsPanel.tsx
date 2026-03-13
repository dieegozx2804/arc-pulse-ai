import { motion } from "framer-motion";
import { FileText, FileSpreadsheet, BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const reports = [
  { id: "semanal", label: "Relatório Semanal", desc: "Resumo de vendas, leads e conversões da semana", icon: <FileText size={20} />, format: "Word" },
  { id: "ranking", label: "Ranking de Vendedores", desc: "Planilha com ranking completo e métricas individuais", icon: <FileSpreadsheet size={20} />, format: "Excel" },
  { id: "dashboard", label: "Dashboard Power BI", desc: "Abrir dashboard interativo de vendas", icon: <BarChart3 size={20} />, format: "Power BI" },
  { id: "mensal", label: "Relatório Mensal", desc: "Análise completa do desempenho mensal da equipe", icon: <FileText size={20} />, format: "Word" },
  { id: "funil", label: "Análise de Funil", desc: "Exportar dados do funil comercial em planilha", icon: <FileSpreadsheet size={20} />, format: "Excel" },
];

const ReportsPanel = () => {
  const handleGenerate = (label: string, format: string) => {
    toast.success(`Gerando ${label}...`, {
      description: `Formato: ${format}. O arquivo será preparado em instantes.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      <h2 className="text-sm tracking-[0.3em] text-primary/80" style={{ fontFamily: "Orbitron" }}>
        RELATÓRIOS
      </h2>

      <div className="space-y-3">
        {reports.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 p-4 bg-card/50 border border-border rounded-xl backdrop-blur-sm hover:border-primary/30 transition-colors"
          >
            <div className="text-primary/70">{r.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{r.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[0.6rem] tracking-wider text-muted-foreground uppercase px-2 py-1 rounded border border-border">
                {r.format}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary/60 hover:text-primary"
                onClick={() => handleGenerate(r.label, r.format)}
              >
                <Download size={16} />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-muted-foreground text-center"
      >
        Diga <span className="text-primary">"Jarvis, gere relatório da semana"</span> para gerar por voz.
      </motion.p>
    </motion.div>
  );
};

export default ReportsPanel;
