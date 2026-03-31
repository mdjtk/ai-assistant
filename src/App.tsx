import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { cn } from './lib/utils';
import { Message } from './types';
import { geminiService } from './services/gemini';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome. I am the professional AI assistant for Midlaj Thonikkadavan. How may I assist you with his portfolio or professional background today?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSend = async (text: string = input) => {
    const msg = text.trim();
    if (!msg || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      timestamp: Date.now(),
    };

    setInput('');
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage([...messages, userMessage]);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Sorry, I'm having trouble connecting right now.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[var(--p-bg)] text-[var(--p-text)] font-sans selection:bg-[var(--p-accent)]/30">
      {/* Portfolio Background Mockup */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-widest mb-4 uppercase text-neutral-600">
            Midlaj <span className="text-neutral-400">Thonikkadavan</span>
          </h1>
          <p className="text-base text-[var(--p-muted)] max-w-lg mx-auto mb-8 leading-relaxed">
            Passionate Full-Stack Developer building high-quality, user-centric applications.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => setIsOpen(true)}
              className="px-6 py-2.5 bg-[var(--p-accent)] text-[#0a0a0a] font-bold rounded-full hover:scale-105 transition-transform text-sm"
            >
              Chat with Assistant
            </button>
          </div>
        </motion.div>
      </main>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 sm:bottom-28 sm:right-8 z-[150] w-12 h-12 bg-[var(--p-bg3)] border border-[var(--p-border2)] text-[var(--p-text)] rounded-full flex items-center justify-center hover:bg-[var(--p-border)] transition-colors shadow-lg"
            title="Back to Top"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-[200] bg-[var(--p-accent)] text-[#0a0a0a] w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] rounded-full text-xl shadow-[0_4px_24px_rgba(200,241,53,0.3)] transition-all hover:scale-110 flex items-center justify-center border-none cursor-pointer"
        title="Ask me anything"
      >
        💬
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            className="fixed bottom-[5rem] right-4 sm:bottom-[5.5rem] sm:right-8 z-[200] w-[calc(100vw-2rem)] sm:w-[380px] bg-[var(--p-bg2)] border border-[var(--p-border2)] rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.6)] flex flex-col max-h-[70vh] sm:max-h-[520px]"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--p-border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-[36px] h-[36px] rounded-full bg-[var(--p-accent)] flex items-center justify-center text-xs text-[#0a0a0a] font-bold">AI</div>
                <div>
                  <div className="text-[14px] font-bold">Midlaj's Assistant</div>
                  <div className="text-[11px] text-[#4ade80] flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" /> Online
                  </div>
                </div>
              </div>
              <button 
                className="bg-none border-none text-[var(--p-muted)] text-xl cursor-pointer p-1 hover:text-[var(--p-text)] transition-colors" 
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-[50vh] sm:min-h-0 max-h-[320px] sm:max-h-[320px] scrollbar-thin scrollbar-thumb-[var(--p-border2)]"
            >
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={cn(
                    "max-w-[90%] flex flex-col",
                    m.role === 'assistant' ? 'self-start' : 'self-end items-end'
                  )}
                >
                  <div className={cn(
                    "px-4 py-3 rounded-xl font-mono text-[13px] leading-relaxed",
                    m.role === 'assistant' 
                      ? 'bg-[var(--p-bg3)] text-[var(--p-text)] rounded-tl-[2px]' 
                      : 'bg-[var(--p-accent)] text-[#0a0a0a] rounded-tr-[2px]'
                  )}>
                    <div className="prose prose-invert prose-xs max-w-none">
                      <Markdown
                        components={{
                          a: ({ node, ...props }) => (
                            <a 
                              {...props} 
                              className={cn(
                                "underline font-medium transition-colors",
                                m.role === 'assistant' ? "text-[var(--p-accent)] hover:text-white" : "text-black hover:text-neutral-700"
                              )} 
                            />
                          )
                        }}
                      >
                        {m.content}
                      </Markdown>
                    </div>
                  </div>
                  <div className="text-[10px] text-[var(--p-muted)] mt-1.5 px-1 font-mono">
                    {m.role === 'assistant' && m.id === '1' ? 'Just now' : formatTime(m.timestamp)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="self-start max-w-[90%] flex flex-col">
                  <div className="bg-[var(--p-bg3)] px-4 py-3 rounded-xl rounded-tl-[2px]">
                    <div className="flex gap-1 items-center">
                      {[0, 0.2, 0.4].map(d => (
                        <span 
                          key={d} 
                          className="w-1.5 h-1.5 rounded-full bg-[var(--p-muted)] animate-pulse" 
                          style={{ animationDelay: `${d}s` }} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Questions */}
            {!isLoading && messages.length < 3 && (
              <div className="px-4 pb-4 flex flex-wrap gap-2">
                {["How can I contact him?", "What's his GitHub?", "Is he available to hire?"].map(s => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-[10px] px-3 py-1.5 rounded-full border border-[var(--p-border2)] bg-transparent text-[var(--p-muted)] cursor-pointer font-mono hover:border-[var(--p-accent)] hover:text-[var(--p-accent)] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-[var(--p-border)] flex gap-3 items-center bg-[var(--p-bg2)]">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything..."
                className="flex-1 bg-[var(--p-bg3)] border border-[var(--p-border)] rounded-xl px-4 py-3 font-mono text-[13px] text-[var(--p-text)] outline-none focus:border-[var(--p-accent)] transition-colors placeholder:text-[var(--p-muted)]"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-[var(--p-accent)] text-[#0a0a0a] w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-none cursor-pointer hover:bg-[var(--p-accent2)] transition-colors disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
