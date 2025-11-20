import React, { useState } from 'react';
import { Challenge } from '../types';
import { Flag, HelpCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface GameInterfaceProps {
  challenge: Challenge;
  onSolve: (id: string, points: number) => void;
  onBack: () => void;
  requestHint: () => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ challenge, onSolve, onBack, requestHint }) => {
  const [flagInput, setFlagInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flagInput.trim() === challenge.flag) {
      setStatus('success');
      setTimeout(() => {
        onSolve(challenge.id, challenge.points);
      }, 1500);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/80 border border-gray-800 rounded-lg relative overflow-hidden">
       {/* Header */}
       <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <div>
             <button onClick={onBack} className="text-xs text-gray-400 hover:text-white uppercase mb-1">← Back to Grid</button>
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <Flag size={20} className="text-blue-500" />
               {challenge.title}
             </h2>
          </div>
          <div className="text-right">
             <div className="text-2xl font-mono font-bold text-blue-400">{challenge.points} PTS</div>
             <div className="text-xs text-gray-500">{challenge.difficulty}</div>
          </div>
       </div>

       {/* Content */}
       <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
             <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-2">Mission Briefing</h3>
             <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{challenge.description}</p>
          </div>

          {challenge.content && (
            <div className="mb-6">
               <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-2">Artifacts / Data</h3>
               <div className="bg-gray-950 border border-gray-800 p-4 rounded font-mono text-sm text-green-400 overflow-x-auto select-text">
                  {challenge.content}
               </div>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button 
                onClick={requestHint}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-900/20 text-yellow-500 border border-yellow-900/50 hover:bg-yellow-900/40 rounded transition-colors"
            >
                <HelpCircle size={16} />
                Request Intelligence (Hint)
            </button>
          </div>
       </div>

       {/* Footer / Input */}
       <div className="p-6 border-t border-gray-800 bg-gray-900/30">
          <form onSubmit={handleSubmit} className="relative">
             <input 
               type="text" 
               value={flagInput}
               onChange={(e) => setFlagInput(e.target.value)}
               placeholder="Enter Flag: CTF{...}"
               className={`
                 w-full bg-black border-2 px-4 py-4 rounded text-lg font-mono outline-none transition-colors
                 ${status === 'error' ? 'border-red-500 text-red-500' : 
                   status === 'success' ? 'border-green-500 text-green-500' : 'border-gray-700 text-white focus:border-blue-500'}
               `}
             />
             <button 
               type="submit"
               className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-6 rounded font-bold uppercase tracking-wider transition-colors"
             >
               Submit
             </button>
          </form>
          
          {/* Feedback Messages */}
          {status === 'error' && (
             <div className="absolute top-[-40px] left-6 flex items-center gap-2 text-red-400 font-bold animate-bounce">
                <XCircle size={20} />
                <span>ACCESS DENIED: INCORRECT FLAG</span>
             </div>
          )}
           {status === 'success' && (
             <div className="absolute top-[-40px] left-6 flex items-center gap-2 text-green-400 font-bold animate-bounce">
                <CheckCircle size={20} />
                <span>ACCESS GRANTED: SYSTEM UNLOCKED</span>
             </div>
          )}
       </div>
    </div>
  );
};

export default GameInterface;