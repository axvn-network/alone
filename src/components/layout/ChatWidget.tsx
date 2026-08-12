"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Xin chào! Tôi có thể giúp gì về tài liệu GVI Tech?' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.answer || "Có lỗi xảy ra." }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "Không thể kết nối tới server." }]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[70]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gvi-gold text-gvi-navy w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          AI
        </button>
      ) : (
        <div className="w-80 h-96 card-dark flex flex-col overflow-hidden">
          <div className="p-4 bg-gvi-navy flex justify-between items-center border-b border-gvi-gold/20">
            <span className="text-gvi-gold font-bold text-sm">GVI Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-gvi-silver">✕</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`text-xs ${m.role === 'user' ? 'text-right text-gvi-gold' : 'text-left text-gvi-silver'}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="text-xs text-gvi-muted">Đang tìm kiếm...</div>}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-2 bg-gvi-navy">
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gvi-darker text-xs p-2 text-gvi-ivory border border-gvi-gold/20 rounded"
              placeholder="Nhập câu hỏi..."
            />
          </form>
        </div>
      )}
    </div>
  );
}
