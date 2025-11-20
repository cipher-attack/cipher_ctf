import React from 'react';
import { Challenge, Difficulty, Category } from '../types';
import { Lock, Unlock, Code, Cpu, Globe, Shield, Terminal as TerminalIcon, Eye, Key } from 'lucide-react';

interface ChallengeCardProps {
  challenge: Challenge;
  isSolved: boolean;
  onSelect: (challenge: Challenge) => void;
}

const getIcon = (category: Category) => {
  switch (category) {
    case Category.CRYPTO: return <Key size={20} />;
    case Category.WEB: return <Globe size={20} />;
    case Category.REVERSE: return <Cpu size={20} />;
    case Category.FORENSICS: return <Eye size={20} />;
    case Category.OSINT: return <TerminalIcon size={20} />;
    case Category.LOGIC: return <Code size={20} />;
    default: return <Shield size={20} />;
  }
};

const getColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.BEGINNER: return 'border-green-500/50 text-green-400 shadow-green-900/20';
    case Difficulty.INTERMEDIATE: return 'border-blue-500/50 text-blue-400 shadow-blue-900/20';
    case Difficulty.ADVANCED: return 'border-purple-500/50 text-purple-400 shadow-purple-900/20';
    case Difficulty.EXPERT: return 'border-orange-500/50 text-orange-400 shadow-orange-900/20';
    default: return 'border-red-500/50 text-red-400 shadow-red-900/20';
  }
};

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, isSolved, onSelect }) => {
  const colorClass = getColor(challenge.difficulty);

  return (
    <div 
      onClick={() => onSelect(challenge)}
      className={`
        relative p-4 rounded border bg-black/80 backdrop-blur-sm cursor-pointer transition-all duration-300 group
        hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]
        ${isSolved ? 'border-green-500/30 opacity-60' : `${colorClass} hover:border-opacity-100`}
      `}
    >
      {isSolved && (
        <div className="absolute top-2 right-2 text-green-500">
            <Unlock size={16} />
        </div>
      )}
      {!isSolved && (
        <div className="absolute top-2 right-2 opacity-30">
            <Lock size={16} />
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-full bg-opacity-10 ${isSolved ? 'bg-green-500 text-green-500' : 'bg-white text-white'}`}>
             {getIcon(challenge.category)}
        </div>
        <div>
             <h3 className="font-bold text-sm md:text-base uppercase tracking-wide">{challenge.title}</h3>
             <span className="text-xs opacity-60">{challenge.category}</span>
        </div>
      </div>

      <div className="flex justify-between items-end mt-4">
        <span className={`text-xs px-2 py-1 rounded border ${colorClass} bg-opacity-10`}>
            {challenge.difficulty}
        </span>
        <span className="font-mono font-bold text-lg">{challenge.points} PTS</span>
      </div>
      
      {/* Hover effect scanline */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded opacity-0 group-hover:opacity-20">
         <div className="w-full h-full bg-gradient-to-b from-transparent via-white to-transparent translate-y-[-100%] group-hover:animate-[scan_1s_linear_infinite]"></div>
      </div>
    </div>
  );
};

export default ChallengeCard;