import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  shuffleDeck, dealCards, isValidMove, getTrickWinner, 
  calculateBotBid, getBotMove, calculateScores, 
  Card, Player, PlayedCard 
} from '../lib/callbreakEngine';
import { playSound } from '../lib/soundUtils';
import { Play, RotateCcw, Award, CheckCircle, Trophy, Sparkles, Smartphone, Maximize2, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

// --- Components ---

interface CardViewProps {
  card: Card;
  onClick?: () => void;
  playable?: boolean;
  played?: boolean;
  style?: React.CSSProperties;
  small?: boolean;
  isHidden?: boolean;
}

const CardView: React.FC<CardViewProps> = ({ card, onClick, playable, played, style, small, isHidden }) => {
  const isRed = card.suit === 'H' || card.suit === 'D';
  const suitIcons: Record<string, string> = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };
  const rankMap: Record<number, string> = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' };
  const displayRank = rankMap[card.rank] || card.rank.toString();

  // Optimized sizes for Mobile Landscape: Cards should be larger relative to screen
  // Default (Phone Landscape): w-14 h-20 (previously w-10 h-14 was too small)
  // Tablet/Desktop: w-20 h-28 or larger
  const baseClasses = small 
    ? 'w-10 h-14' 
    : 'w-[4.5rem] h-24 md:w-20 md:h-28 lg:w-24 lg:h-36'; // Significantly increased base size for mobile

  if (isHidden) {
    return (
      <div 
        className={`relative bg-blue-800 rounded-lg shadow-md border-2 border-white/20 flex items-center justify-center select-none ${baseClasses}`}
        style={style}
      >
        <div className="w-full h-full opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwYXRoIGQ9Ik0wIDBoOHY4SDB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]"></div>
      </div>
    );
  }

  return (
    <div 
      onClick={playable ? onClick : undefined}
      className={`
        relative bg-white rounded-lg shadow-xl border border-gray-300 flex flex-col justify-between p-1 select-none transition-all duration-200
        ${baseClasses}
        ${playable ? 'cursor-pointer hover:-translate-y-4 md:hover:-translate-y-6 hover:shadow-2xl hover:border-yellow-400 hover:ring-2 hover:ring-yellow-400 z-10' : ''}
        ${played ? 'animate-slide-up shadow-2xl scale-110' : ''}
      `}
      style={{
        ...style,
        color: isRed ? '#ef4444' : '#1f2937',
        background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)'
      }}
    >
      <div className={`${small ? 'text-xs' : 'text-base md:text-xl'} font-black leading-none flex flex-col items-center`}>
        <span>{displayRank}</span>
        <span className={small ? 'text-xs' : 'text-sm md:text-xl'}>{suitIcons[card.suit]}</span>
      </div>
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 ${small ? 'text-2xl' : 'text-4xl md:text-5xl'}`}>
        {suitIcons[card.suit]}
      </div>
      <div className={`${small ? 'text-xs' : 'text-base md:text-xl'} font-black leading-none flex flex-col items-center rotate-180`}>
        <span>{displayRank}</span>
        <span>{suitIcons[card.suit]}</span>
      </div>
    </div>
  );
};

const PlayerAvatar = ({ player, currentTurn, isWinner, position }: { player: Player, currentTurn: number, isWinner?: boolean, position: 'bottom' | 'top' | 'left' | 'right' }) => {
  const avatarUrl = player.id === 0 
    ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150' 
    : player.id === 1 
      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=150&h=150'
      : player.id === 2
        ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=150&h=150'
        : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=150&h=150';

  return (
    <div className={`flex flex-col items-center transition-all duration-500 relative z-20 ${currentTurn === player.id ? 'scale-110' : 'scale-100 opacity-90'}`}>
      
      {/* Avatar Circle */}
      <div className={`
        relative w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full p-1 shadow-2xl bg-white
        ${currentTurn === player.id ? 'bg-gradient-to-r from-yellow-300 to-orange-400 animate-pulse' : 'bg-gray-200'}
        ${isWinner ? 'bg-gradient-to-r from-green-400 to-emerald-600 ring-4 ring-green-400' : ''}
      `}>
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white relative">
           <img src={avatarUrl} alt={player.name} className="w-full h-full object-cover" />
           {player.isBot && <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>}
        </div>
        
        {/* Turn Indicator */}
        {currentTurn === player.id && (
           <div className="absolute -top-1 -right-1 bg-yellow-400 text-black rounded-full p-1 shadow-lg border-2 border-white animate-bounce">
             <Sparkles size={12} fill="currentColor" />
           </div>
        )}
      </div>

      {/* Name Badge */}
      <div className="absolute -bottom-2 z-30">
        <span className="block text-[9px] md:text-xs lg:text-sm font-black text-white bg-gray-900 px-2 py-0.5 rounded-full border border-gray-700 shadow-xl truncate max-w-[100px] text-center">
          {player.name}
        </span>
      </div>

      {/* Stats Display (Bid/Won) */}
      <div className={`
        absolute ${position === 'bottom' ? 'top-0 -right-14 md:-right-16' : position === 'left' ? '-bottom-6 md:-bottom-8' : position === 'right' ? '-bottom-6 md:-bottom-8' : '-right-14 md:-right-16 top-0'} 
        bg-black/60 backdrop-blur-md rounded-lg p-0.5 md:p-1 border border-white/10 shadow-lg flex items-center space-x-1 md:space-x-2
      `}>
         <div className="flex flex-col items-center px-1 border-r border-white/20">
           <span className="text-[7px] md:text-[8px] text-yellow-200 font-bold uppercase">Bid</span>
           <span className="text-xs md:text-sm font-black text-yellow-400 leading-none">{player.bid}</span>
         </div>
         <div className="flex flex-col items-center px-1">
           <span className="text-[7px] md:text-[8px] text-green-200 font-bold uppercase">Won</span>
           <span className="text-xs md:text-sm font-black text-green-400 leading-none">{player.tricksWon}</span>
         </div>
      </div>

    </div>
  );
};

// --- Main Page ---

const CallbreakPage = () => {
  const { t } = useApp();
  const [gameState, setGameState] = useState<'IDLE' | 'SHUFFLING' | 'BIDDING' | 'PLAYING' | 'ROUND_END' | 'GAME_END'>('IDLE');
  const [round, setRound] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0); 
  const [trick, setTrick] = useState<PlayedCard[]>([]);
  const [msg, setMsg] = useState('Welcome to Callbreak!');
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const playersRef = useRef<Player[]>([]);
  const trickRef = useRef<PlayedCard[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Orientation Check ---
  useEffect(() => {
    const checkOrientation = () => {
      // If height > width, it's portrait
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const handleEnterLandscape = async () => {
    try {
      const doc = document.documentElement;
      if (doc.requestFullscreen) {
        await doc.requestFullscreen();
      } else if ((doc as any).webkitRequestFullscreen) {
        await (doc as any).webkitRequestFullscreen();
      }
      
      if (screen.orientation && (screen.orientation as any).lock) {
        await (screen.orientation as any).lock('landscape').catch(() => {
          console.log('Orientation lock failed or not supported');
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Game Loop Management ---

  const initGame = useCallback(() => {
    playSound('shuffle');
    const p: Player[] = [
      { id: 0, name: 'You', isBot: false, hand: [], bid: 0, tricksWon: 0, score: 0, totalScore: 0 },
      { id: 1, name: 'Sita (AI)', isBot: true, hand: [], bid: 0, tricksWon: 0, score: 0, totalScore: 0 },
      { id: 2, name: 'Ram (AI)', isBot: true, hand: [], bid: 0, tricksWon: 0, score: 0, totalScore: 0 },
      { id: 3, name: 'Gita (AI)', isBot: true, hand: [], bid: 0, tricksWon: 0, score: 0, totalScore: 0 },
    ];
    playersRef.current = p;
    setPlayers(p);
    setRound(1);
    startRound(p, 1);
  }, []);

  const startRound = (currentPlayers: Player[], roundNum: number) => {
    setGameState('SHUFFLING');
    setMsg('Shuffling Cards...');
    playSound('shuffle');

    // Reset basics
    setTrick([]);
    trickRef.current = [];
    setCurrentTurn(0);
    
    // Simulate Shuffle Animation Duration
    setTimeout(() => {
        dealAndStart(currentPlayers);
    }, 2500);
  };

  const dealAndStart = (currentPlayers: Player[]) => {
    setMsg('Dealing...');
    const deck = shuffleDeck();
    const hands = dealCards(deck);
    
    const updatedPlayers = currentPlayers.map((p, idx) => ({
      ...p,
      hand: hands[idx],
      bid: 0,
      tricksWon: 0,
      score: 0
    }));

    playersRef.current = updatedPlayers;
    setPlayers(updatedPlayers);
    
    // Small delay to show dealt cards
    setTimeout(() => {
        setGameState('BIDDING');
        setMsg('Your Turn to Bid!');
    }, 500);
  }

  // --- Bidding ---

  const handleUserBid = (bid: number) => {
    playSound('bid');
    const newPlayers = [...playersRef.current];
    newPlayers[0].bid = bid;
    
    // Bots bid
    for (let i = 1; i < 4; i++) {
      newPlayers[i].bid = calculateBotBid(newPlayers[i].hand, 'medium');
    }

    playersRef.current = newPlayers;
    setPlayers(newPlayers);
    setGameState('PLAYING');
    setMsg('Game Started!');
  };

  // --- Playing Logic ---

  const playCard = (playerId: number, card: Card) => {
    playSound('card');
    const newPlayers = [...playersRef.current];
    const player = newPlayers[playerId];
    player.hand = player.hand.filter(c => c.id !== card.id);
    
    const move: PlayedCard = { playerId, card };
    const newTrick = [...trickRef.current, move];
    
    playersRef.current = newPlayers;
    trickRef.current = newTrick;
    setPlayers(newPlayers);
    setTrick(newTrick);

    if (newTrick.length === 4) {
      setTimeout(resolveTrick, 1500);
    } else {
      const next = (playerId + 1) % 4;
      setCurrentTurn(next);
    }
  };

  const resolveTrick = () => {
    const currentTrick = trickRef.current;
    const winnerId = getTrickWinner(currentTrick);
    
    const newPlayers = [...playersRef.current];
    newPlayers[winnerId].tricksWon += 1;
    
    playersRef.current = newPlayers;
    trickRef.current = [];
    setPlayers(newPlayers);
    setTrick([]);
    setMsg(`${newPlayers[winnerId].name} Wins!`);
    
    if (winnerId === 0) playSound('win');

    if (newPlayers[0].hand.length === 0) {
      setTimeout(endRound, 1000);
    } else {
      setCurrentTurn(winnerId);
    }
  };

  const endRound = () => {
    const scoredPlayers = calculateScores(playersRef.current);
    playersRef.current = scoredPlayers;
    setPlayers(scoredPlayers);
    setGameState('ROUND_END');
    setShowScoreboard(true);
    playSound('win');
  };

  const nextRound = () => {
    setShowScoreboard(false);
    if (round < 5) {
      const nextR = round + 1;
      setRound(nextR);
      startRound(playersRef.current, nextR);
    } else {
      setGameState('GAME_END');
    }
  };

  useEffect(() => {
    if (gameState === 'PLAYING' && currentTurn !== 0 && trick.length < 4) {
      const botId = currentTurn;
      const botPlayer = playersRef.current[botId];
      timerRef.current = setTimeout(() => {
        const cardToPlay = getBotMove(botPlayer.hand, trickRef.current, 'medium');
        playCard(botId, cardToPlay);
      }, 1200);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentTurn, gameState, trick.length]);

  useEffect(() => {
    initGame();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [initGame]);

  // --- Render Helpers ---

  // Shuffle Animation Component
  const renderShuffleAnimation = () => {
    if (gameState !== 'SHUFFLING') return null;
    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="relative w-24 h-36">
                {[0, 1, 2, 3, 4].map(i => (
                    <div 
                        key={i}
                        className="absolute inset-0 bg-blue-800 rounded-lg border-2 border-white shadow-xl animate-pulse"
                        style={{
                            transform: `rotate(${i * 5 - 10}deg)`,
                            animation: `shuffleMove 0.5s infinite alternate ${i * 0.1}s`
                        }}
                    >
                        <div className="w-full h-full opacity-30 bg-pattern"></div>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes shuffleMove {
                    0% { transform: translateX(0) rotate(0); }
                    100% { transform: translateX(50px) rotate(15deg); }
                }
                .bg-pattern {
                    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h2v2H1V1zm4 4h2v2H5V5zm4 4h2v2H9V9z' fill='%23ffffff' fill-opacity='0.2'/%3E%3C/svg%3E");
                }
            `}</style>
        </div>
    );
  };

  const renderBiddingModal = () => {
    if (gameState !== 'BIDDING') return null;
    return (
      <div className="absolute inset-x-0 top-0 bottom-[35%] z-40 flex items-center justify-center animate-fade-in pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent pointer-events-auto"></div>
        <div className="relative z-50 bg-gray-900/95 p-6 rounded-3xl shadow-2xl border border-yellow-500/30 max-w-sm w-full mx-4 text-center animate-bounce-in pointer-events-auto backdrop-blur-md">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Bid Your Hand</h2>
          <p className="text-gray-400 mb-4 text-xs md:text-sm">How many tricks will you win?</p>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <button
                key={num}
                onClick={() => handleUserBid(num)}
                className="aspect-square flex items-center justify-center text-xl md:text-2xl font-black rounded-xl bg-gray-800 hover:bg-yellow-500 hover:text-black hover:scale-110 transition-all duration-200 text-white shadow-lg border border-gray-700 hover:border-yellow-400 active:scale-95"
              >
                {num}
              </button>
            ))}
          </div>
          <p className="text-[10px] md:text-xs text-yellow-500/80 mt-4 font-bold uppercase tracking-wider">♠ Check your cards below</p>
        </div>
      </div>
    );
  };

  const renderScoreboard = () => {
    if (!showScoreboard && gameState !== 'GAME_END') return null;
    const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);
    const winner = sortedPlayers[0];

    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in p-4 overflow-y-auto">
        {/* Confetti (Simple CSS Simulation) */}
        {gameState === 'GAME_END' && (
             <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute top-10 right-1/4 w-3 h-3 bg-yellow-500 rounded-full animate-ping delay-100"></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full animate-ping delay-200"></div>
             </div>
        )}

        <div className="bg-gray-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-700 relative">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-2 relative z-10">
              {gameState === 'GAME_END' ? '🏆 Tournament Champion' : `Round ${round} Complete`}
            </h2>
            {gameState === 'GAME_END' ? (
              <div className="flex flex-col items-center mt-4 animate-bounce relative z-10">
                <Trophy size={80} className="text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]" />
                <p className="text-3xl font-black mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">{winner.name}</p>
                <p className="text-sm text-yellow-200/80 font-bold uppercase tracking-widest mt-1">Total Score: {winner.totalScore.toFixed(1)}</p>
              </div>
            ) : (
                <p className="text-purple-200 relative z-10">Get ready for the next round!</p>
            )}
          </div>
          
          {/* Table */}
          <div className="p-4 md:p-6 bg-gray-800/50">
            <div className="grid grid-cols-4 gap-4 mb-2 text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-wider text-center border-b border-gray-700 pb-3">
              <div className="text-left pl-4">Player</div>
              <div className="bg-gray-800/50 rounded py-1">Bid</div>
              <div className="bg-gray-800/50 rounded py-1">Won</div>
              <div className="bg-gray-800/50 rounded py-1">Score</div>
            </div>
            {players.map((p, idx) => (
              <div key={p.id} className={`grid grid-cols-4 gap-4 py-3 md:py-4 border-b border-gray-800 text-sm md:text-base items-center text-center rounded-xl transition-all duration-300 ${p.id === 0 ? 'bg-indigo-900/30 border border-indigo-500/30' : 'hover:bg-gray-800'}`}>
                <div className="text-left pl-4 flex items-center gap-3 font-bold text-gray-200">
                  <div className={`w-8 h-8 rounded-full border-2 ${idx === 0 ? 'border-yellow-400' : 'border-gray-600'} overflow-hidden`}>
                     {/* Reuse avatar logic simply */}
                     <div className={`w-full h-full ${p.id === 0 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                  </div>
                  <span>{p.name} {p.id === 0 && '(You)'}</span>
                </div>
                <div className="font-bold text-gray-400">{p.bid}</div>
                <div className={`font-black ${p.tricksWon >= p.bid ? 'text-green-400' : 'text-red-400'}`}>{p.tricksWon}</div>
                <div className="font-black text-white text-lg md:text-xl">{p.totalScore.toFixed(1)}</div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-gray-900 flex justify-center border-t border-gray-800">
            {gameState === 'GAME_END' ? (
              <button onClick={initGame} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-black transition shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95 text-lg">
                <RotateCcw size={24} /> Play Again
              </button>
            ) : (
              <button onClick={nextRound} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-black transition shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 text-lg">
                Next Round <Play size={24} fill="currentColor" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const user = players[0];
  const botLeft = players[1];
  const botTop = players[2];
  const botRight = players[3];
  const leadSuit = trick.length > 0 ? trick[0].card.suit : null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1b4d3e] overflow-hidden flex flex-col font-sans select-none touch-manipulation">
      
      {/* Felt Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      {/* Portrait Mode Warning Overlay */}
      {isPortrait && (
        <div className="absolute inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-8 text-center animate-fade-in text-white">
          <Smartphone size={64} className="mb-4 animate-spin-slow rotate-90" />
          <h2 className="text-2xl font-bold mb-2">Horizontal View Required</h2>
          <p className="text-gray-400 mb-6">For the best experience, please rotate your device to landscape mode.</p>
          <button 
            onClick={handleEnterLandscape}
            className="flex items-center gap-2 px-6 py-3 bg-nepalBlue hover:bg-blue-700 rounded-xl font-bold transition shadow-lg text-white"
          >
            <Maximize2 size={20} /> Enter Landscape
          </button>
        </div>
      )}

      {/* Close Button */}
      <div className="absolute top-4 left-4 z-40">
        <a href="#/news" className="flex items-center gap-2 bg-black/30 backdrop-blur px-3 py-1.5 rounded-full text-white/80 hover:bg-black/50 text-xs font-bold border border-white/10 transition-colors">
            Exit
        </a>
      </div>

      {/* Info Bar */}
      <div className="absolute top-4 left-0 right-0 z-30 flex justify-center pointer-events-none">
        <div className="flex items-center gap-4">
            <div className="bg-black/40 backdrop-blur text-white text-xs font-bold px-4 py-1.5 rounded-full border border-white/10 shadow-sm flex items-center gap-2">
            <Award size={14} className="text-yellow-400" />
            <span>Round {round}/5</span>
            </div>
            
            {msg && (
            <div className="bg-yellow-400/90 text-black text-xs font-black px-6 py-1.5 rounded-full shadow-lg animate-slide-down border-2 border-white text-center min-w-[150px] truncate">
                {msg}
            </div>
            )}
        </div>
      </div>

      {/* Shuffle Animation Layer */}
      {renderShuffleAnimation()}

      {/* Game Board */}
      <div className="flex-grow relative flex items-center justify-center w-full h-full">
        
        {/* Center Table */}
        <div className="relative w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] flex items-center justify-center">
            
            {/* Played Cards Area */}
            {trick.map((play, i) => {
              let trans = '';
              // Landscape Coordinates
              if (play.playerId === 0) trans = 'translate-y-12 lg:translate-y-24 scale-110';
              if (play.playerId === 1) trans = '-translate-x-20 lg:-translate-x-32 -rotate-12 scale-100';
              if (play.playerId === 2) trans = '-translate-y-12 lg:-translate-y-24 scale-100';
              if (play.playerId === 3) trans = 'translate-x-20 lg:translate-x-32 rotate-12 scale-100';
              
              return (
                <div key={play.card.id} className={`absolute z-${i + 10} transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) transform ${trans}`}>
                   <CardView card={play.card} played />
                </div>
              );
            })}
            
            {/* Empty Table Indicator */}
            {trick.length === 0 && gameState === 'PLAYING' && (
              <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center animate-pulse">
                <div className="text-white/20 font-black text-xs text-center px-2">
                  {players[currentTurn]?.name}'s Turn
                </div>
              </div>
            )}
        </div>

        {/* --- Bots Positioning (Landscape) --- */}

        {/* Top Player (Ram) */}
        {botTop && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
             <PlayerAvatar player={botTop} currentTurn={currentTurn} position="top" />
             <div className="mt-[-25px] flex -space-x-4 opacity-100 scale-50">
               {botTop.hand.map((card, i) => (
                 <CardView key={i} card={card} isHidden small style={{transform: `rotate(${(i-6)*2}deg)`}} />
               ))}
             </div>
          </div>
        )}

        {/* Left Player (Sita) */}
        {botLeft && (
          <div className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 flex flex-col items-start z-10">
             <PlayerAvatar player={botLeft} currentTurn={currentTurn} position="left" />
             <div className="mt-2 ml-[-30px] flex flex-col -space-y-12 opacity-100 scale-50 origin-top-left">
               {botLeft.hand.map((card, i) => (
                 <CardView key={i} card={card} isHidden small style={{transform: `rotate(90deg)`}} />
               ))}
             </div>
          </div>
        )}

        {/* Right Player (Gita) */}
        {botRight && (
          <div className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end z-10">
             <PlayerAvatar player={botRight} currentTurn={currentTurn} position="right" />
             <div className="mt-2 mr-[-30px] flex flex-col -space-y-12 opacity-100 scale-50 origin-top-right">
               {botRight.hand.map((card, i) => (
                 <CardView key={i} card={card} isHidden small style={{transform: `rotate(-90deg)`}} />
               ))}
             </div>
          </div>
        )}

        {/* --- User Player (Bottom) --- */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center">
             
             <div className="absolute bottom-4 right-4 md:right-8 lg:right-24 lg:bottom-12">
               <PlayerAvatar player={user} currentTurn={currentTurn} position="bottom" />
             </div>

             {/* User Hand - Optimized for Mobile Landscape */}
             <div className="relative w-full max-w-4xl px-2 h-28 md:h-32 lg:h-48 flex justify-center items-end mb-1 md:mb-2 lg:mb-4">
               <div className="flex justify-center w-full" style={{ marginLeft: '0px' }}>
                 {user.hand.map((card, i) => {
                   const valid = gameState === 'PLAYING' && currentTurn === 0 && isValidMove(card, user.hand, leadSuit, trick);
                   const offset = i - (user.hand.length - 1) / 2;
                   const rotation = offset * 3; // Slightly more rotation for fan effect
                   const yTrans = Math.abs(offset) * 3;

                   return (
                     <div 
                       key={card.id} 
                       className="transform transition-all duration-200 hover:z-50 origin-bottom"
                       style={{ 
                         // Dynamic margin based on hand size to prevent cards going offscreen
                         marginLeft: i === 0 ? 0 : `calc(-3vw - 15px)`, 
                         marginBottom: valid ? `${20 + yTrans}px` : `${yTrans}px`,
                         zIndex: i,
                         transform: `rotate(${rotation}deg)`,
                       }}
                     >
                       <CardView 
                         card={card} 
                         playable={valid} 
                         onClick={() => valid && playCard(0, card)}
                         style={{ 
                            opacity: (!valid && currentTurn === 0 && gameState === 'PLAYING') ? 0.6 : 1,
                            filter: (!valid && currentTurn === 0 && gameState === 'PLAYING') ? 'grayscale(0.5)' : 'none'
                         }}
                       />
                     </div>
                   );
                 })}
               </div>
             </div>
          </div>
        )}

      </div>

      {renderBiddingModal()}
      {renderScoreboard()}

    </div>
  );
};

export default CallbreakPage;