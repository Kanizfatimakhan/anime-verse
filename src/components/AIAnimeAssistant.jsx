import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const QUICK_CHIPS = [
  { label: '🔥 Top Trending', prompt: 'What are the top 3 anime trending right now and why should I watch them?' },
  { label: '🧠 Thriller like Death Note', prompt: 'Recommend 3 psychological thrillers with high-stakes mind games like Death Note.' },
  { label: '🌸 Warm Romance', prompt: 'Give me 3 beautiful, emotional romance anime with great animation.' },
  { label: '⚔️ Peak Shonen', prompt: 'Recommend shonen anime with movie-quality fight animation.' },
  { label: '⚡ Quick Binge (< 13 Eps)', prompt: 'Recommend a complete, masterclass anime with 12 or 13 episodes.' },
];

const LOCAL_KNOWLEDGE = {
  trending: "Here are 3 mega-hits dominating the anime world right now:\n\n1. **Solo Leveling** — Pure adrenaline power-fantasy with jaw-dropping A-1 Pictures animation.\n2. **Jujutsu Kaisen Season 2** — The Shibuya Incident arc is modern shonen peak.\n3. **Frieren: Beyond Journey's End** — A melancholic, deeply philosophical masterpiece about time and humanity.",
  thriller: "If you love mind games and psychological tension:\n\n1. **Monster** — The definitive cat-and-mouse psychological masterpiece by Naoki Urasawa.\n2. **Steins;Gate** — High-stakes time travel thriller with impeccable writing.\n3. **Psycho-Pass** — Dystopian cyberpunk investigating morality and criminal minds.",
  romance: "Heartfelt romances that will leave a lasting impression:\n\n1. **Your Lie in April** — A breathtaking journey of music, trauma, and love.\n2. **Kaguya-sama: Love Is War** — Genius psychological comedy meets genuine romance.\n3. **The Dangers in My Heart** — One of the best modern wholesome romance developments in recent years.",
  shonen: "Peak action with jaw-dropping choreography:\n\n1. **Demon Slayer** — ufotable's industry-defining animation and emotional battles.\n2. **Chainsaw Man** — Gritty, cinematic, unhinged action by MAPPA.\n3. **Mob Psycho 100** — Bones studio's peak kinetic animation and heart.",
  quick: "Short masterclasses you can finish in one weekend:\n\n1. **Cyberpunk: Edgerunners (10 Eps)** — Pure neon adrenaline and tragedy by Studio Trigger.\n2. **Erased (12 Eps)** — Gripping murder mystery thriller that keeps you guessing.\n3. **Ping Pong the Animation (11 Eps)** — Directed by Masaaki Yuasa, a complete coming-of-age masterpiece.",
};

export default function AIAnimeAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Konnichiwa! ⛩️ I'm your AnimeVerse Guide. Ask me for recommendations, plot explanations, or pick a mood below!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const generateAIResponse = async (userText) => {
    await new Promise(r => setTimeout(r, 600));
    const lower = userText.toLowerCase();

    if (lower.includes('trend') || lower.includes('popular') || lower.includes('best')) {
      return LOCAL_KNOWLEDGE.trending;
    }
    if (lower.includes('thrill') || lower.includes('death note') || lower.includes('mind') || lower.includes('dark')) {
      return LOCAL_KNOWLEDGE.thriller;
    }
    if (lower.includes('romance') || lower.includes('love') || lower.includes('cry') || lower.includes('sad')) {
      return LOCAL_KNOWLEDGE.romance;
    }
    if (lower.includes('shonen') || lower.includes('action') || lower.includes('fight')) {
      return LOCAL_KNOWLEDGE.shonen;
    }
    if (lower.includes('short') || lower.includes('quick') || lower.includes('12') || lower.includes('13')) {
      return LOCAL_KNOWLEDGE.quick;
    }

    return `Here are two incredible anime suited for your inquiry:\n\n1. **Attack on Titan** — A generational epic filled with intense political intrigue, colossal plot twists, and unforgettable music by Hiroyuki Sawano.\n\n2. **Vinland Saga** — A profound historical epic tracing a young Viking's quest for vengeance and the meaning of true strength.`;
  };

  const handleSend = async (customPrompt) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    if (!customPrompt) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);

    try {
      const aiReply = await generateAIResponse(textToSend);
      setMessages(prev => [...prev, { role: 'ai', text: aiReply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: 'Gomen! Something went wrong while retrieving your recommendation. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 z-[110] h-[min(480px,calc(100dvh-12rem))] max-h-[calc(100dvh-12rem)] w-[calc(100vw-2rem)] sm:right-6 sm:w-[420px] bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-3.5 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-text uppercase tracking-widest text-xs">AnimeVerse Guide</h3>
                  <p className="text-[10px] text-accent font-semibold uppercase tracking-wider">Instant recommendations</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([{ role: 'ai', text: 'Chat reset. How can I help you discover your next favorite anime?' }])}
                  className="p-1.5 text-muted hover:text-text hover:bg-white/5 rounded-lg transition-colors"
                  title="Clear chat"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-white/[0.02] border-b border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.prompt)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap bg-white/5 hover:bg-primary/20 text-muted hover:text-primary border border-white/5 transition-all"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-tr-sm shadow-md'
                        : 'bg-zinc-900/90 border border-white/10 text-zinc-200 rounded-tl-sm whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-white/10 p-3 rounded-2xl rounded-tl-sm text-primary text-xs flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing anime universe...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-zinc-900/60 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for an anime recommendation..."
                  className="w-full bg-black/60 border border-white/10 rounded-full pl-4 pr-11 py-2.5 text-xs text-text placeholder:text-muted/60 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="absolute right-1.5 p-1.5 bg-primary text-white rounded-full disabled:opacity-40 hover:scale-105 transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 shadow-[0_0_25px_rgba(124,58,237,0.5)] border border-white/20 flex items-center justify-center text-white relative overflow-hidden group"
        title="Anime AI Guide"
      >
        <div className="w-full h-full rounded-full bg-zinc-950/80 backdrop-blur-md flex items-center justify-center transition-colors group-hover:bg-transparent">
          {isOpen ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5 text-accent group-hover:text-white" />}
        </div>
      </motion.button>
    </div>
  );
}
