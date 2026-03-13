import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Filter,
  FileText,
  FlaskConical,
  Settings,
  X,
} from "lucide-react";

export type MenuSection =
  | "dashboard"
  | "equipe"
  | "previsao"
  | "funil"
  | "relatorios"
  | "simulacao"
  | "config";

interface SideMenuProps {
  open: boolean;
  active: MenuSection | null;
  onSelect: (section: MenuSection) => void;
  onClose: () => void;
}

const menuItems: { id: MenuSection; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard Comercial", icon: <LayoutDashboard size={18} /> },
  { id: "equipe", label: "Performance da Equipe", icon: <Users size={18} /> },
  { id: "previsao", label: "Previsão de Vendas", icon: <TrendingUp size={18} /> },
  { id: "funil", label: "Funil Comercial", icon: <Filter size={18} /> },
  { id: "relatorios", label: "Relatórios", icon: <FileText size={18} /> },
  { id: "simulacao", label: "Simulações Estratégicas", icon: <FlaskConical size={18} /> },
  { id: "config", label: "Configurações", icon: <Settings size={18} /> },
];

const SideMenu = ({ open, active, onSelect, onClose }: SideMenuProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Menu */}
          <motion.nav
            className="fixed left-0 top-0 bottom-0 z-40 w-72 bg-card/95 backdrop-blur-md border-r border-border flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-border/50">
              <span
                className="text-[0.65rem] tracking-[0.3em] text-primary/80"
                style={{ fontFamily: "Orbitron" }}
              >
                JARVIS COMERCIAL
              </span>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 py-4 space-y-1 px-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                    active === item.id
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                  style={{ fontFamily: "Rajdhani" }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-border/50">
              <p className="text-[0.55rem] text-muted-foreground tracking-wider" style={{ fontFamily: "Orbitron" }}>
                UNIMED BAURU
              </p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideMenu;
