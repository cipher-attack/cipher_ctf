import React, { useState, useEffect, useCallback } from 'react';
import { CORE_CHALLENGES, APP_VERSION, DEV_NAME } from './constants';
import { AIPersonality, Category, Challenge, Difficulty, Message, UserState } from './types';
import { getAIResponse, generateDynamicChallenge } from './services/geminiService';
import Terminal from './components/Terminal';
import ChallengeCard from './components/ChallengeCard';
import GameInterface from './components/GameInterface';
import { Shield, User, Cpu, Zap, PlusCircle, LayoutGrid } from 'lucide-react';

// Helper to format time
const getTime = () => new Date().toLocaleTimeString();

const App: React.FC = () => {
  // -- STATE --
  const [user, setUser] = useState<UserState>({
    username: 'GUEST_OPERATOR',
    personality: AIPersonality.ENIGMATIC_HACKER,
    solvedChallenges: [],
    score: 0,
    rank: 'Script Kiddie'
  });
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', sender: 'system', text: `INITIALIZING CIPHER PROTOCOL v${APP_VERSION}...`, timestamp: Date.now() },
    { id: 'init2', sender: 'ai', text: "Welcome, Operator. I am your assigned AI Handler. Select a challenge to begin our session.", timestamp: Date.now() + 100 }
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>(CORE_CHALLENGES);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');

  // -- EFFECTS --

  // Initial Welcome Message adjustment based on personality
  useEffect(() => {
     // Can add initial flavor text here if desired
  }, [user.personality]);

  // -- HANDLERS --

  const handleSendMessage = async (text: string) => {
    // User Message
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsAiTyping(true);

    // Context for AI
    const context = activeChallenge 
      ? `User is working on challenge "${activeChallenge.title}" (Category: ${activeChallenge.category}). Description: ${activeChallenge.description}. Flag: ${activeChallenge.flag}. User Score: ${user.score}.`
      : `User is in the dashboard. Score: ${user.score}. Solved: ${user.solvedChallenges.length}. Available Challenges: ${challenges.length}.`;

    // AI Response
    const aiText = await getAIResponse(text, user.personality, context);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiText, timestamp: Date.now() };
    
    setMessages(prev => [...prev, aiMsg]);
    setIsAiTyping(false);
  };

  const handleChallengeSolve = (id: string, points: number) => {
    if (user.solvedChallenges.includes(id)) return;

    const newScore = user.score + points;
    let newRank = user.rank;
    if (newScore > 500) newRank = "Hacker";
    if (newScore > 1500) newRank = "Elite";
    if (newScore > 3000) newRank = "Cyber God";

    setUser(prev => ({
      ...prev,
      score: newScore,
      solvedChallenges: [...prev.solvedChallenges, id],
      rank: newRank
    }));
    
    setActiveChallenge(null); // Go back to dashboard
    
    // Success Message
    const successMsg: Message = { 
      id: Date.now().toString(), 
      sender: 'system', 
      text: `CHALLENGE COMPLETE. ${points} POINTS ADDED. SYSTEM UPGRADED.`, 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, successMsg]);
    
    // AI Congratulation
    handleSendMessage("I just solved the challenge! How did I do?");
  };

  const handleGenerateChallenge = async () => {
    setIsAiTyping(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'system', text: "GENERATING NEW SIMULATION PARAMETERS...", timestamp: Date.now() }]);
    
    const cats = Object.values(Category);
    const randomCat = cats[Math.floor(Math.random() * cats.length)];
    const diffs = Object.values(Difficulty);
    const randomDiff = diffs[Math.floor(Math.random() * diffs.length)];

    const newChallenge = await generateDynamicChallenge(randomCat, randomDiff);
    
    setIsAiTyping(false);
    
    if (newChallenge) {
      setChallenges(prev => [newChallenge, ...prev]);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'system', 
        text: `NEW CHALLENGE GENERATED: ${newChallenge.title} [${newChallenge.difficulty}]`, 
        timestamp: Date.now() 
      }]);
    } else {
       setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'system', text: "GENERATION FAILED. TRY AGAIN.", timestamp: Date.now() }]);
    }
  };

  const handleHintRequest = () => {
    if (!activeChallenge) return;
    handleSendMessage(`Can you give me a hint for ${activeChallenge.title}? The current hint is: ${activeChallenge.hint}`);
  };

  // -- RENDER --

  const filteredChallenges = selectedCategory === 'ALL' 
    ? challenges 
    : challenges.filter(c => c.category === selectedCategory);

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-green-400 overflow-hidden relative selection:bg-green-900 selection:text-white">
      
      {/* Top Bar */}
      <header className="h-16 border-b border-green-900/30 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-green-900/20 rounded border border-green-500/30 animate-pulse">
             <Cpu size={24} className="text-green-400" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-widest text-white">CIPHER <span className="text-green-500 text-xs align-top">v2025</span></h1>
            <p className="text-[10px] text-gray-500 uppercase">Dev: {DEV_NAME}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right hidden md:block">
            <div className="text-xs text-gray-500">OPERATOR</div>
            <div className="font-bold text-white">{user.username}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">SCORE</div>
            <div className="font-bold text-blue-400 text-xl font-mono">{user.score.toString().padStart(6, '0')}</div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs text-gray-500">RANK</div>
            <div className="font-bold text-purple-400">{user.rank}</div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 flex overflow-hidden z-10">
        
        {/* LEFT: Dashboard / Game Area */}
        <main className="flex-1 flex flex-col relative p-6 overflow-hidden">
          
          {/* Category Filter (Only on Dashboard) */}
          {!activeChallenge && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                onClick={() => setSelectedCategory('ALL')}
                className={`px-4 py-2 rounded border whitespace-nowrap transition-all ${selectedCategory === 'ALL' ? 'bg-green-500 text-black font-bold border-green-500' : 'border-gray-800 text-gray-400 hover:border-green-500 hover:text-green-400'}`}
              >
                <LayoutGrid size={14} className="inline mr-2"/> ALL MODULES
              </button>
              {Object.values(Category).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded border whitespace-nowrap text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-800 text-gray-400 hover:border-blue-500 hover:text-blue-400'}`}
                >
                  {cat}
                </button>
              ))}
               <button 
                  onClick={handleGenerateChallenge}
                  className="px-4 py-2 rounded border border-purple-500/50 text-purple-400 hover:bg-purple-900/20 whitespace-nowrap flex items-center gap-2 ml-auto"
                >
                  <Zap size={14} />
                  GENERATE NEW
                </button>
            </div>
          )}

          {/* Content Switcher */}
          {activeChallenge ? (
            <GameInterface 
              challenge={activeChallenge} 
              onBack={() => setActiveChallenge(null)} 
              onSolve={handleChallengeSolve}
              requestHint={handleHintRequest}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-20 pr-2 custom-scroll">
              {filteredChallenges.map(c => (
                <ChallengeCard 
                  key={c.id} 
                  challenge={c} 
                  isSolved={user.solvedChallenges.includes(c.id)}
                  onSelect={setActiveChallenge}
                />
              ))}
            </div>
          )}
        </main>

        {/* RIGHT: AI Terminal (Fixed width on desktop, collapsible logic could be added for mobile) */}
        <aside className="w-96 border-l border-green-900/30 bg-black/40 backdrop-blur-xl hidden md:block">
           <div className="h-full p-4">
              <div className="mb-4 flex justify-between items-center">
                  <label className="text-xs text-gray-500 uppercase">AI Personality</label>
                  <select 
                    value={user.personality}
                    onChange={(e) => setUser(prev => ({ ...prev, personality: e.target.value as AIPersonality }))}
                    className="bg-black border border-gray-700 text-xs text-white rounded px-2 py-1 outline-none focus:border-green-500"
                  >
                    {Object.values(AIPersonality).map(p => (
                      <option key={p} value={p}>{p.replace('_', ' ')}</option>
                    ))}
                  </select>
              </div>
              <Terminal 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                isTyping={isAiTyping}
              />
           </div>
        </aside>
      </div>

      {/* Mobile Terminal Toggle (Simple Overlay implementation logic would go here for full mobile support, omitted for brevity in SPA single file constraint context but visual placeholder exists) */}
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-green-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>
      
      {/* Scanline Effect */}
      <div className="scanline"></div>
    </div>
  );
};

export default App;