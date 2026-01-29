import React from 'react';
import { motion } from 'framer-motion';
import { Dices } from 'lucide-react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  onClick: () => void;
  disabled: boolean;
  color: string;
}

export const Dice: React.FC<DiceProps> = ({ value, isRolling, onClick, disabled, color }) => {
  const dots = [
    [],
    [4],
    [0, 8],
    [0, 4, 8],
    [0, 2, 6, 8],
    [0, 2, 4, 6, 8],
    [0, 2, 3, 5, 6, 8]
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={onClick}
        className={`
          w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl
          transition-all duration-300 relative
          ${disabled ? 'bg-zinc-800 opacity-50 cursor-not-allowed' : 'bg-white cursor-pointer'}
        `}
        style={{ color: disabled ? '#3f3f46' : color }}
      >
        {isRolling ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
          >
            <Dices size={48} />
          </motion.div>
        ) : (
          <div className="grid grid-cols-3 grid-rows-3 w-16 h-16 gap-1 p-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                {dots[value].includes(i) && (
                  <div className="w-3 h-3 rounded-full bg-current" />
                )}
              </div>
            ))}
          </div>
        )}
      </motion.button>
      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
        {disabled ? "Waiting..." : "Roll Dice"}
      </span>
    </div>
  );
};