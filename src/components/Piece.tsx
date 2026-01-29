import React from 'react';
import { motion } from 'framer-motion';
import { PlayerColor } from '../types/game';
import { getGridCoords } from '../utils/gameLogic';

interface PieceProps {
  color: PlayerColor;
  position: number;
  homeIndex: number;
  onClick: () => void;
  isMovable: boolean;
}

export const PieceComp: React.FC<PieceProps> = ({ color, position, homeIndex, onClick, isMovable }) => {
  const { x, y } = getGridCoords(position, color, homeIndex);
  
  const colorClasses = {
    red: 'bg-red-500 border-red-700 shadow-red-900/40',
    blue: 'bg-blue-500 border-blue-700 shadow-blue-900/40',
    green: 'bg-green-500 border-green-700 shadow-green-900/40',
    yellow: 'bg-yellow-500 border-yellow-700 shadow-yellow-900/40',
  };

  return (
    <motion.div
      initial={false}
      animate={{ 
        gridColumnStart: x + 1, 
        gridRowStart: y + 1,
        scale: isMovable ? 1.1 : 1,
        opacity: 1
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={isMovable ? onClick : undefined}
      className={`
        w-[75%] h-[75%] rounded-full border-2 flex items-center justify-center
        shadow-lg cursor-pointer transition-all duration-200 z-50 self-center justify-self-center
        ${colorClasses[color]}
        ${isMovable ? 'ring-4 ring-white ring-opacity-50 animate-pulse' : ''}
      `}
    >
      <div className="w-1/2 h-1/2 rounded-full bg-white opacity-20" />
    </motion.div>
  );
};