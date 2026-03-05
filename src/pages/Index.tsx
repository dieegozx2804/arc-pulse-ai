import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, X, MessageSquare } from "lucide-react";
import ArcReactor from "@/components/ArcReactor";
import TypewriterText from "@/components/TypewriterText";
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
  "Boa noite, senhor. Todos os sistemas operacionais.",
  "À sua disposição, senhor.",
  "Sistema J.A.R.V.I.S. online. Aguardando instruções.",
];

const JARVIS_RESPONSES = [
  "Entendido, senhor. Processando sua solicitação agora.",
  "Análise concluída. Essa é uma excelente questão, senhor.",
  "Já estou trabalhando nisso. Os resultados são promissores.",
  "Fascinante. Permita-me analisar antes de fornecer uma resposta.",
  "Claro, senhor. Executando protocolo de busca.",
  "Interessante perspectiva. Sugiro uma abordagem mais estratégica.",
];

const CHAT_TRIGGER_WORDS = ["chat", "texto", "digitar", "escrever", "teclado", "mensagem", "liberar chat", "abrir chat"];
const CHAT_CLOSE_WORDS = ["fechar chat", "esconder chat", "só voz", "somente voz", "tirar chat"];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [showGreeting, setShowGreeting] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isListening, isSpeaking, transcript, startListening, stopListening, speak, supported } = useSpeech();

  // Greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const g = JARVIS_GREETINGS[Math.floor(Math.random() * JARVIS_GREETINGS.length)];
      setGreeting(g);
      setShowGreeting(true);
      speak(g);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Handle voice transcript
  useEffect(() => {
    if (!transcript) return;

    const lower = transcript.toLowerCase();

    // Check for chat toggle commands
    if (CHAT_TRIGGER_WORDS.some(w => lower.includes(w))) {
      setChatVisible(true);
      const response = "Chat de texto liberado, senhor. Pode digitar à vontade.";
      setLastResponse(response);
      setShowResponse(true);
      setShowGreeting(false);
      speak(response);
      addMessage("user", transcript);
      addMessage("assistant", response);
      return;
    }

    if (CHAT_CLOSE_WORDS.some(w => lower.includes(w))) {
      setChatVisible(false);
      const response = "Chat fechado. Continuamos apenas por voz, senhor.";
      setLastResponse(response);
      setShowResponse(true);
      setShowGreeting(false);
      speak(response);
      return;
    }

    // Normal message
    handleSend(transcript);
  }, [transcript]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (chatVisible) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [chatVisible]);

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
    }]);
  };

  const handleSend = useCallback((text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isProcessing) return;

    addMessage("user", msg.trim());
    setInput("");
    setIsProcessing(true);
    setShowGreeting(false);

    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const response = JARVIS_RESPONSES[Math.floor(Math.random() * JARVIS_RESPONSES.length)];
      addMessage("assistant", response);
      setLastResponse(response);
      setShowResponse(true);
      setIsProcessing(false);
      speak(response);
    }, delay);
  }, [input, isProcessing, speak]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setShowGreeting(false);
      setShowResponse(false);
      startListening();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(190 100% 50%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(190 100% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial gradient backdrop */}
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(210 100% 8% / 0.5) 0%, hsl(220 20% 4%) 70%)',
        }}
      />

      {/* Main content - centered */}
      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-lg px-6">

        {/* J.A.R.V.I.S. title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary glow-pulse" />
          <h1 className="text-xs tracking-[0.5em] text-primary/60" style={{ fontFamily: 'Orbitron' }}>
            J.A.R.V.I.S.
          </h1>
          <div className="w-1.5 h-1.5 rounded-full bg-primary glow-pulse" />
        </motion.div>

        {/* Arc Reactor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 1, type: "spring" }}
        >
          <ArcReactor isListening={isListening} isProcessing={isProcessing || isSpeaking} size={180} />
        </motion.div>

        {/* Voice waveform */}
        <AnimatePresence>
          {(isListening || isSpeaking) && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0.5 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.5 }}
              className="w-full max-w-xs"
            >
              <VoiceWaveform isActive={isListening || isSpeaking} barCount={40} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Greeting / Response text */}
        <AnimatePresence mode="wait">
          {showGreeting && greeting && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center max-w-sm"
            >
              <TypewriterText
                text={greeting}
                speed={25}
                className="text-sm text-foreground/80"
              />
            </motion.div>
          )}
          {showResponse && lastResponse && !showGreeting && !isProcessing && (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center max-w-sm"
            >
              <TypewriterText
                text={lastResponse}
                speed={18}
                className="text-sm text-foreground/80"
              />
            </motion.div>
          )}
          {isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mic button */}
        {supported && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={toggleListening}
              className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? 'bg-primary/20 border-2 border-primary shadow-[0_0_30px_hsl(190_100%_50%_/_0.4)]'
                  : 'bg-card/50 border border-border hover:border-primary/50 hover:shadow-[0_0_20px_hsl(190_100%_50%_/_0.2)]'
              }`}
            >
              <Mic size={22} className={isListening ? 'text-primary' : 'text-muted-foreground'} />
              {isListening && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-primary/30"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </button>
          </motion.div>
        )}

        {/* Hint text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-[0.55rem] text-muted-foreground tracking-[0.25em] text-center"
          style={{ fontFamily: 'Orbitron' }}
        >
          {isListening ? 'OUVINDO...' : 'TOQUE PARA FALAR • DIGA "ABRIR CHAT" PARA DIGITAR'}
        </motion.p>
      </div>

      {/* Chat panel - slides up from bottom */}
      <AnimatePresence>
        {chatVisible && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-20 bg-card/95 backdrop-blur-md border-t border-border rounded-t-2xl"
            style={{ maxHeight: '50vh' }}
          >
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-primary" />
                <span className="text-xs tracking-[0.2em] text-muted-foreground" style={{ fontFamily: 'Orbitron' }}>
                  CHAT
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setChatVisible(false)}
              >
                <X size={14} />
              </Button>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: 'calc(50vh - 110px)' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
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

            {/* Input */}
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-primary"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isProcessing}
                >
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
