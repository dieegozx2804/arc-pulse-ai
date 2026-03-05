import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Volume2, VolumeX, Trash2 } from "lucide-react";
import ArcReactor from "@/components/ArcReactor";
import TypewriterText from "@/components/TypewriterText";
import HudWidget from "@/components/HudWidget";
import VoiceWaveform from "@/components/VoiceWaveform";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/useSpeech";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const JARVIS_GREETINGS = [
  "Boa noite, senhor. Todos os sistemas operacionais. Como posso ajudá-lo?",
  "À sua disposição, senhor. Todos os sensores calibrados.",
  "Sistema J.A.R.V.I.S. online. Aguardando instruções.",
];

const JARVIS_RESPONSES = [
  "Entendido, senhor. Processando sua solicitação agora.",
  "Análise concluída. Baseado nos dados disponíveis, posso informar que essa é uma excelente questão.",
  "Já estou trabalhando nisso, senhor. Os resultados preliminares são promissores.",
  "Fascinante. Permita-me analisar todos os ângulos antes de fornecer uma resposta completa.",
  "Claro, senhor. Executando protocolo de busca nos meus bancos de dados.",
  "Interessante perspectiva. Considerando as variáveis envolvidas, sugiro uma abordagem mais estratégica.",
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isListening, isSpeaking, transcript, startListening, stopListening, speak, stopSpeaking, supported } = useSpeech();

  // Greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const greeting = JARVIS_GREETINGS[Math.floor(Math.random() * JARVIS_GREETINGS.length)];
      setMessages([{
        id: crypto.randomUUID(),
        role: "assistant",
        content: greeting,
        timestamp: new Date(),
      }]);
      setInitialized(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle voice transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      // Auto-send after voice input
      setTimeout(() => handleSend(transcript), 300);
    }
  }, [transcript]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback((text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isProcessing) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: msg.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsProcessing(true);

    // Simulate AI response
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const response = JARVIS_RESPONSES[Math.floor(Math.random() * JARVIS_RESPONSES.length)];
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsProcessing(false);
      if (voiceEnabled) speak(response);
    }, delay);
  }, [input, isProcessing, voiceEnabled, speak]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    stopSpeaking();
  };

  return (
    <div className="relative flex h-screen overflow-hidden scanline-overlay">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(190 100% 50%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(190 100% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Left sidebar - HUD */}
      <motion.aside
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden lg:flex w-56 flex-col p-4 border-r border-border/50 z-10"
      >
        <div className="mb-4">
          <h2 className="text-[0.65rem] tracking-[0.4em] text-muted-foreground" style={{ fontFamily: 'Orbitron' }}>
            SYSTEM STATUS
          </h2>
        </div>
        <HudWidget />
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center z-10 relative">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex items-center justify-between px-6 py-3 border-b border-border/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary glow-pulse" />
            <h1 className="text-sm tracking-[0.4em] text-primary" style={{ fontFamily: 'Orbitron' }}>
              J.A.R.V.I.S.
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => { setVoiceEnabled(!voiceEnabled); if (isSpeaking) stopSpeaking(); }}
            >
              {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={clearChat}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </motion.header>

        {/* Arc Reactor + Messages area */}
        <div className="flex-1 w-full max-w-2xl flex flex-col overflow-hidden">
          {/* Arc Reactor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex justify-center py-6 shrink-0"
          >
            <ArcReactor isListening={isListening} isProcessing={isProcessing} size={140} />
          </motion.div>

          {/* Voice waveform */}
          <div className="px-6 shrink-0">
            <VoiceWaveform isActive={isListening || isSpeaking} />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-secondary text-secondary-foreground border border-border'
                      : 'bg-card/80 text-foreground border border-primary/20'
                  }`}>
                    {msg.role === 'assistant' && i === messages.length - 1 && !isProcessing ? (
                      <TypewriterText text={msg.content} speed={18} />
                    ) : (
                      msg.content
                    )}
                    <div className="text-[0.6rem] text-muted-foreground mt-1 tracking-wider" style={{ fontFamily: 'Orbitron' }}>
                      {msg.timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-card/80 border border-primary/20 rounded-lg px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground tracking-wider" style={{ fontFamily: 'Orbitron' }}>
                    PROCESSANDO
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="shrink-0 px-6 pb-6 pt-2"
          >
            <div className="flex items-center gap-2 border border-border rounded-lg bg-card/50 backdrop-blur-sm px-3 py-2 focus-within:border-primary/50 transition-colors">
              {supported && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 shrink-0 ${isListening ? 'text-primary animate-pulse' : 'text-muted-foreground hover:text-primary'}`}
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? <Mic size={16} /> : <MicOff size={16} />}
                </Button>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite seu comando, senhor..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                style={{ fontFamily: 'Rajdhani' }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-primary"
                onClick={() => handleSend()}
                disabled={!input.trim() || isProcessing}
              >
                <Send size={16} />
              </Button>
            </div>
            <p className="text-center text-[0.55rem] text-muted-foreground mt-2 tracking-[0.2em]" style={{ fontFamily: 'Orbitron' }}>
              JUST A RATHER VERY INTELLIGENT SYSTEM — v3.0.5
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
