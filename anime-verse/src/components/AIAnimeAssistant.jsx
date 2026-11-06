import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini (Replace with real key in .env)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
let genAI = null;
try {
  if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
} catch (e) {
  console.warn("Gemini AI init failed:", e);
}

export default function AIAnimeAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm your Gemini AI Anime Guide. Need a recommendation based on your mood?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      let aiResponse = "";
      
      if (!API_KEY) {
        // Fallback if no API key is provided
        await new Promise(r => setTimeout(r, 1500));
        aiResponse = "I'm currently in offline mode because the Gemini API key is missing from the .env file! However, I'd highly recommend checking out 'Attack on Titan' or 'Jujutsu Kaisen'.";
      } else {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `You are a premium AI Anime Assistant for 'AnimeVerse'. Answer the user's query about anime. Keep it short, spoiler-free, formatted nicely, and highly engaging. Query: ${userText}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        aiResponse = response.text();
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Oops, something went wrong while thinking!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[500px] max-h-[70vh] bg-background/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 text-primary rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text uppercase tracking-widest text-sm">Gemini Guide</h3>
                  <p className="text-[10px] text-muted uppercase">Powered by Google AI</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-sm' 
                      : 'bg-white/5 border border-white/10 text-text rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-sm text-primary flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for an anime recommendation..."
                  className="w-full bg-black/50 border border-white/10 rounded-full px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors pr-12"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="absolute right-2 p-2 bg-primary text-white rounded-full disabled:opacity-50 hover:bg-primary/80 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-background backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center text-primary overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-primary/10 animate-pulse" />
        {isOpen ? <X className="w-6 h-6 z-10" /> : <Bot className="w-6 h-6 z-10" />}
      </motion.button>
    </div>
  );
}
