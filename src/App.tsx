import React, { useState, useCallback, useEffect } from 'react';
import { Trophy, RotateCcw, Info, User, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerColor, Piece, GameState } from './types/game';
import { PieceComp } from './components/Piece';
import { Dice } from './components/Dice';

const COLORS: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];
const START_OFFSET = { red: 0, green: 13, yellow: 26, blue: 39 };

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(() => ({
    players: COLORS,
    turn: 'red',
    pieces: COLORS.flatMap(color => 
      [0, 1, 2, 3].map(i => ({ id: Math.random(), color, position: -1, homeIndex: i }))
    ),
    diceValue: 1,
    isRolling: false,
    hasRolled: false,
    winner: null,
    history: ['Game started! Red goes first.']
  }));

  const rollDice = () => {
    if (state.hasRolled || state.isRolling) return;
    setState(prev => ({ ...prev, isRolling: true }));
    
    setTimeout(() => {
      const val = Math.floor(Math.random() * 6) + 1;
      setState(prev => {
        const canMove = prev.pieces
          .filter(p => p.color === prev.turn)
          .some(p => p.position !== -1 || val === 6);

        const newState = { 
          ...prev, 
          diceValue: val, 
          isRolling: false, 
          hasRolled: true,
          history: [`${prev.turn.toUpperCase()} rolled a ${val}`, ...prev.history].slice(0, 10)
        };

        if (!canMove) {
          setTimeout(() => nextTurn(), 1000);
        }
        return newState;
      });
    }, 800);
  };

  const nextTurn = () => {
    setState(prev => {
      const currentIndex = COLORS.indexOf(prev.turn);
      const nextIndex = (currentIndex + 1) % 4;
      return { ...prev, turn: COLORS[nextIndex], hasRolled: false, diceValue: 0 };
    });
  };

  const movePiece = (pieceId: number) => {
    if (!state.hasRolled) return;

    setState(prev => {
      const pIndex = prev.pieces.findIndex(p => p.id === pieceId);
      const piece = prev.pieces[pIndex];
      let newPos = piece.position;

      if (piece.position === -1) {
        if (prev.diceValue === 6) newPos = 0;
        else return prev;
      } else {
        newPos += prev.diceValue;
      }

      if (newPos > 58) return prev;

      const updatedPieces = [...prev.pieces];
      updatedPieces[pIndex] = { ...piece, position: newPos };

      // Simple collision logic (only on track)
      if (newPos < 52 && newPos >= 0) {
        // Calculate global track index
        const globalIndex = (newPos + START_OFFSET[piece.color]) % 52;
        
        updatedPieces.forEach((other, idx) => {
          if (idx === pIndex || other.color === piece.color || other.position < 0 || other.position >= 52) return;
          const otherGlobal = (other.position + START_OFFSET[other.color]) % 52;
          if (globalIndex === otherGlobal) {
            updatedPieces[idx] = { ...other, position: -1 };
            prev.history.unshift(`${piece.color.toUpperCase()} knocked out ${other.color.toUpperCase()}`);
          }
        });
      }

      // Check win condition
      const win = updatedPieces.filter(p => p.color === piece.color && p.position === 58).length === 4;

      const nextState = { 
        ...prev, 
        pieces: updatedPieces, 
        hasRolled: false, 
        winner: win ? piece.color : null,
        history: [`${piece.color.toUpperCase()} moved to ${newPos}`, ...prev.history].slice(0, 10)
      };

      if (prev.diceValue !== 6) {
        const currentIndex = COLORS.indexOf(prev.turn);
        nextState.turn = COLORS[(currentIndex + 1) % 4];
      }

      return nextState;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row items-center justify-center p-4 md:p-8 gap-12 font-sans">
      
      {/* Left Sidebar - Player Status */}
      <div className="w-full md:w-64 flex flex-col gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="text-indigo-400" /> Players
          </h2>
          <div className="space-y-3">
            {COLORS.map(c => (
              <div 
                key={c} 
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${state.turn === c ? 'bg-zinc-800 border-zinc-600 scale-105 shadow-lg' : 'bg-transparent border-transparent opacity-50'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-ludo-${c}`} />
                <span className="capitalize font-medium">{c}</span>
                {state.turn === c && <div className="ml-auto w-2 h-2 rounded-full bg-indigo-400 animate-ping" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <History className="text-emerald-400" /> Game Log
          </h2>
          <div className="space-y-2 h-48 overflow-y-auto text-sm text-zinc-400">
            {state.history.map((log, i) => (
              <div key={i} className="border-l border-zinc-700 pl-3 py-1">{log}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Board Section */}
      <div className="relative">
        <div className="ludo-grid bg-white shadow-2xl relative">
          {/* 15x15 Grid Overlay */}
          {Array.from({ length: 225 }).map((_, i) => {
            const x = i % 15;
            const y = Math.floor(i / 15);
            
            // Large Yards
            if (x < 6 && y < 6) return <div key={i} className="bg-red-100/30" />;
            if (x > 8 && y < 6) return <div key={i} className="bg-green-100/30" />;
            if (x < 6 && y > 8) return <div key={i} className="bg-blue-100/30" />;
            if (x > 8 && y > 8) return <div key={i} className="bg-yellow-100/30" />;
            
            // Middle Path / Safe Zones
            if (x === 7 && y === 7) return <div key={i} className="bg-zinc-800" />;
            
            return <div key={i} className="cell" />;
          })}

          {/* Pieces */}
          <AnimatePresence>
            {state.pieces.map((p) => (
              <PieceComp 
                key={p.id} 
                color={p.color} 
                position={p.position} 
                homeIndex={p.homeIndex} 
                onClick={() => movePiece(p.id)}
                isMovable={state.turn === p.color && state.hasRolled && (p.position !== -1 || state.diceValue === 6)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Winner Overlay */}
        {state.winner && (
          <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center rounded-lg">
            <Trophy size={100} className="text-yellow-400 mb-4 animate-bounce" />
            <h1 className="text-4xl font-black uppercase tracking-widest text-white">{state.winner} Wins!</h1>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold transition-all"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Right Sidebar - Controls */}
      <div className="w-full md:w-64 flex flex-col items-center gap-8">
        <Dice 
          value={state.diceValue}
          isRolling={state.isRolling}
          onClick={rollDice}
          disabled={state.hasRolled || state.winner !== null}
          color={{
            red: '#ef4444',
            blue: '#3b82f6',
            green: '#22c55e',
            yellow: '#eab308'
          }[state.turn]}
        />
        
        <div className="text-center">
          <div className="text-sm text-zinc-500 uppercase tracking-widest mb-2">Current Player</div>
          <div className={`text-2xl font-black uppercase tracking-tighter text-ludo-${state.turn}`}>
            {state.turn}
          </div>
        </div>

        <button 
          onClick={() => window.location.reload()} 
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm uppercase font-bold"
        >
          <RotateCcw size={16} /> Reset Game
        </button>
      </div>
    </div>
  );
};

export default App;