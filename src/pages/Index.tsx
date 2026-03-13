import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MessageSquare, Send, X, Menu } from "lucide-react";
import RadarNucleus from "@/components/RadarNucleus";
import ParticleBackground from "@/components/ParticleBackground";
import SideMenu, { MenuSection } from "@/components/SideMenu";
import VoiceWaveform from "@/components/VoiceWaveform";
import TypewriterText from "@/components/TypewriterText";
import DashboardPanel from "@/components/panels/DashboardPanel";
import TeamPanel from "@/components/panels/TeamPanel";
import ForecastPanel from "@/components/panels/ForecastPanel";
import FunnelPanel from "@/components/panels/FunnelPanel";
import ReportsPanel from "@/components/panels/ReportsPanel";
import SimulationPanel from "@/components/panels/SimulationPanel";
import AlertsPanel from "@/components/panels/AlertsPanel";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/useSpeech";
import { streamChat } from "@/lib/chatStream";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const GREETING = "Jarvis Comercial online. Aguardando instruções, senhor.";

const MENU_OPEN_WORDS = ["abrir menu", "mostrar menu", "mostrar navegação", "abrir navegação"];
const MENU_CLOSE_WORDS = ["fechar menu", "ocultar menu", "ocultar navegação", "fechar navegação"];
const CHAT_OPEN_WORDS = ["abrir chat", "liberar chat", "chat", "texto", "digitar"];
const CHAT_CLOSE_WORDS = ["fechar chat", "esconder chat", "só voz"];

const SECTION_KEYWORDS: Record<MenuSection, string[]> = {
  dashboard: ["dashboard", "painel", "visão geral", "resumo"],
  equipe: ["equipe", "vendedores", "performance", "desempenho da equipe", "ranking"],
  previsao: ["previsão", "previsao", "forecast", "projeção"],
  funil: ["funil", "pipeline", "leads"],
  relatorios: ["relatório", "relatorio", "relatórios", "exportar", "word", "excel", "power bi"],
  simulacao: ["simulação", "simulacao", "simule", "simular", "cenário"],
  config: ["configuração", "configuracao", "config"],
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<MenuSection | null>(null);
  const [jarvisText, setJarvisText] = useState("");
  const [showText, setShowText] = useState(false);
  const [activated, setActivated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isListening, isSpeaking, transcript, startListening, stopListening, speak, supported } = useSpeech();

  // Greeting on activation
  useEffect(() => {
    if (activated) {
      setJarvisText(GREETING);
      setShowText(true);
      speak(GREETING);
    }
  }, [activated]);

  // Handle transcript
  useEffect(() => {
    if (!transcript) return;
    const lower = transcript.toLowerCase();

    // Activation
    if (!activated && lower.includes("jarvis")) {
      setActivated(true);
      return;
    }

    // Menu
    if (MENU_OPEN_WORDS.some(w => lower.includes(w))) {
      setMenuOpen(true);
      respond("Menu aberto, senhor.");
      return;
    }
    if (MENU_CLOSE_WORDS.some(w => lower.includes(w))) {
      setMenuOpen(false);
      respond("Menu fechado.");
      return;
    }

    // Chat
    if (CHAT_OPEN_WORDS.some(w => lower.includes(w))) {
      setChatVisible(true);
      respond("Chat liberado.");
      return;
    }
    if (CHAT_CLOSE_WORDS.some(w => lower.includes(w))) {
      setChatVisible(false);
      respond("Chat fechado.");
      return;
    }

    // Section navigation
    for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
      if (keywords.some(k => lower.includes(k))) {
        setActiveSection(section as MenuSection);
        respond(`Abrindo ${section === 'equipe' ? 'performance da equipe' : section}.`);
        return;
      }
    }

    // Close section
    if (lower.includes("fechar") || lower.includes("voltar") || lower.includes("tela inicial")) {
      setActiveSection(null);
      respond("Voltando à tela principal.");
      return;
    }

    // Alerts
    if (lower.includes("alerta")) {
      setActiveSection(null);
      // Show alerts inline
      respond("Foram detectadas duas oportunidades estratégicas e um alerta de risco.");
      return;
    }

    // Otherwise send to AI
    handleSend(transcript);
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatVisible) setTimeout(() => inputRef.current?.focus(), 300);
  }, [chatVisible]);

  const respond = (text: string) => {
    setJarvisText(text);
    setShowText(true);
    speak(text);
    addMessage("assistant", text);
  };

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role, content }]);
  };

  const handleSend = useCallback(async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isProcessing) return;

    addMessage("user", msg.trim());
    setInput("");
    setIsProcessing(true);
    setShowText(false);

    const history = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: msg.trim() },
    ];

    let assistantSoFar = "";
    const assistantId = crypto.randomUUID();

    try {
      await streamChat({
        messages: history,
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          setJarvisText(assistantSoFar);
          setShowText(true);
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.id === assistantId) {
              return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
            }
            return [...prev, { id: assistantId, role: "assistant", content: assistantSoFar }];
          });
        },
        onDone: () => {
          setIsProcessing(false);
          if (assistantSoFar) speak(assistantSoFar.slice(0, 300));
        },
        onError: (error) => {
          setIsProcessing(false);
          toast.error(error);
        },
      });
    } catch {
      setIsProcessing(false);
      toast.error("Erro ao conectar com o assistente");
    }
  }, [input, isProcessing, messages, speak]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const toggleListening = () => {
    if (isListening) { stopListening(); } else { setShowText(false); startListening(); }
  };

  const handleActivate = () => {
    if (!activated) setActivated(true);
  };

  const handleSectionSelect = (section: MenuSection) => {
    setActiveSection(section);
    setMenuOpen(false);
  };

  const renderPanel = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardPanel />;
      case "equipe": return <TeamPanel />;
      case "previsao": return <ForecastPanel />;
      case "funil": return <FunnelPanel />;
      case "relatorios": return <ReportsPanel />;
      case "simulacao": return <SimulationPanel />;
      default: return null;
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-background">
      <ParticleBackground />

      {/* Top bar with menu button */}
      {activated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4"
        >
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="text-[0.6rem] tracking-[0.4em] text-primary/50" style={{ fontFamily: "Orbitron" }}>
            JARVIS COMERCIAL
          </span>
          {activeSection && (
            <button
              onClick={() => setActiveSection(null)}
              className="text-[0.6rem] tracking-wider text-muted-foreground hover:text-primary transition-colors"
              style={{ fontFamily: "Orbitron" }}
            >
              VOLTAR
            </button>
          )}
          {!activeSection && <div className="w-12" />}
        </motion.div>
      )}

      {/* Side menu */}
      <SideMenu open={menuOpen} active={activeSection} onSelect={handleSectionSelect} onClose={() => setMenuOpen(false)} />

      {/* Main content */}
      <AnimatePresence mode="wait">
        {activeSection ? (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 w-full h-full overflow-y-auto pt-20 pb-32 px-6"
          >
            {renderPanel()}
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            {/* Title */}
            {activated && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary glow-pulse" />
                <h1 className="text-xs tracking-[0.5em] text-primary/60" style={{ fontFamily: "Orbitron" }}>
                  J.A.R.V.I.S.
                </h1>
                <div className="w-1.5 h-1.5 rounded-full bg-primary glow-pulse" />
              </motion.div>
            )}

            {/* Radar nucleus */}
            <RadarNucleus
              isListening={isListening}
              isProcessing={isProcessing || isSpeaking}
              size={activated ? 240 : 280}
              onClick={handleActivate}
            />

            {/* Waveform */}
            <AnimatePresence>
              {(isListening || isSpeaking) && (
                <motion.div initial={{ opacity: 0, scaleX: 0.5 }} animate={{ opacity: 1, scaleX: 1 }} exit={{ opacity: 0, scaleX: 0.5 }} className="w-full max-w-xs">
                  <VoiceWaveform isActive={isListening || isSpeaking} barCount={40} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Jarvis text / greeting */}
            <AnimatePresence mode="wait">
              {!activated && (
                <motion.div key="activate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-2">
                  <p className="text-sm tracking-[0.2em] text-primary/70" style={{ fontFamily: "Orbitron" }}>
                    DIGA 'JARVIS' OU TOQUE
                  </p>
                  <p className="text-xs text-muted-foreground">Toque no núcleo ou diga 'Jarvis'</p>
                </motion.div>
              )}
              {activated && showText && jarvisText && !isProcessing && (
                <motion.div key="response" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-center max-w-md">
                  <TypewriterText text={jarvisText} speed={18} className="text-sm text-foreground/80" />
                </motion.div>
              )}
              {isProcessing && (
                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom controls */}
            {activated && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center gap-4">
                {supported && (
                  <button
                    onClick={toggleListening}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isListening
                        ? 'bg-primary/20 border-2 border-primary shadow-[0_0_25px_hsl(152_100%_40%_/_0.4)]'
                        : 'bg-card/50 border border-border hover:border-primary/50'
                    }`}
                  >
                    <Mic size={18} className={isListening ? 'text-primary' : 'text-muted-foreground'} />
                  </button>
                )}
                <button
                  onClick={() => setChatVisible(!chatVisible)}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-card/50 border border-border hover:border-primary/50 transition-all"
                >
                  <MessageSquare size={18} className="text-muted-foreground" />
                </button>
              </motion.div>
            )}

            {/* Hint */}
            {activated && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="text-[0.5rem] text-muted-foreground tracking-[0.25em] text-center" style={{ fontFamily: "Orbitron" }}>
                {isListening ? 'OUVINDO...' : 'TOQUE PARA FALAR • DIGA "ABRIR MENU" PARA NAVEGAR'}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {chatVisible && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-md border-t border-border rounded-t-2xl"
            style={{ maxHeight: '50vh' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-primary" />
                <span className="text-xs tracking-[0.2em] text-muted-foreground" style={{ fontFamily: "Orbitron" }}>CHAT</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setChatVisible(false)}>
                <X size={14} />
              </Button>
            </div>

            <div className="overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: 'calc(50vh - 110px)' }}>
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${
                    msg.role === 'user'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted/50 text-foreground border border-primary/10'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 pb-4 pt-2">
              <div className="flex items-center gap-2 border border-border rounded-xl bg-background/50 px-3 py-2 focus-within:border-primary/40 transition-colors">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite aqui, senhor..."
                  className="flex-1 bg-transparent border-none outline-none text-xs text-foreground placeholder:text-muted-foreground"
                />
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-primary"
                  onClick={() => handleSend()} disabled={!input.trim() || isProcessing}>
                  <Send size={14} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
