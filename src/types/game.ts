export type PlayerColor = 'red' | 'blue' | 'yellow' | 'green';

export interface Piece {
  id: number;
  color: PlayerColor;
  position: number; // -1 to -4 (home yard), 0-51 (track), 52-57 (home path), 58 (final win)
  homeIndex: number;
}

export interface GameState {
  players: PlayerColor[];
  turn: PlayerColor;
  pieces: Piece[];
  diceValue: number;
  isRolling: boolean;
  hasRolled: boolean;
  winner: PlayerColor | null;
  history: string[];
}