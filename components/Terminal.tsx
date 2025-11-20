import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = React.useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-black/90 border-2 border-green-900/50 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.1)] font-mono text-sm md:text-base overflow-hidden relative">
      {/* Header */}
      <div className="bg-green-900/20 p-2 border-b border-green-900/50 flex items-center gap-2">
        <TerminalIcon size={16} className="text-green-500" />
        <span className="text-green-500 font-bold tracking-wider">AI_UPLINK // SECURE_CHANNEL</span>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg border ${
                msg.sender === 'user'
                  ? 'bg-green-900/20 border-green-500/50 text-green-100'
                  : msg.sender === 'system'
                  ? 'bg-red-900/20 border-red-500/50 text-red-200 font-bold w-full text-center'
                  : 'bg-slate-900/80 border-blue-500/50 text-blue-200'
              }`}
            >
              <span className="text-xs opacity-50 mb-1 block uppercase">{msg.sender}</span>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start animate-pulse">
            <div className="bg-slate-900/80 border border-blue-500/50 p-3 rounded-lg text-blue-200">
              <span className="text-xs opacity-50 mb-1 block">AI HOST</span>
              <p>Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-black border-t border-green-900/50 flex gap-2">
        <span className="text-green-500 py-2 font-bold">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder-green-900 font-mono"
          placeholder="Ask for a hint, status check, or help..."
        />
        <button 
            type="submit" 
            className="text-green-500 hover:text-green-400 px-4 border border-green-900/50 hover:border-green-500/50 rounded uppercase text-xs tracking-widest transition-all"
        >
            Send
        </button>
      </form>
    </div>
  );
};

export default Terminal;