import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { Habit } from '../types.ts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AskGemini: React.FC<{ habits: Habit[], userName: string, themeColor: string }> = ({ habits, userName, themeColor }) => {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: `Hey ${userName}! Need help with your routine?` }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const habitSummary = habits.map(h => `${h.name}: ${Object.values(h.completions).flat().length} completions`).join(', ');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are an elite habit coach for ${userName}. Habits: ${habitSummary}. Be brief, professional, and highly motivating.`
        }
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I'm offline right now." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Failed to connect. Check your API key!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex-shrink-0">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={14} style={{ color: themeColor }} /> AI Coach
        </h2>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar scroll-container">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none shadow-md' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'}`} style={{ backgroundColor: m.role === 'user' ? themeColor : undefined }}>{m.content}</div>
          </div>
        ))}
        {isTyping && <div className="text-xs font-bold text-slate-400 p-2 animate-pulse">Coach is typing...</div>}
        <div className="h-4" />
      </div>
      <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="relative flex items-center">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Message..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-4 text-sm font-bold text-slate-700 outline-none" />
          <button onClick={handleSend} disabled={isTyping} className="absolute right-2 p-2 rounded-xl text-white disabled:opacity-50" style={{ backgroundColor: themeColor }}><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default AskGemini;