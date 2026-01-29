import { PlayerColor, Piece } from '../types/game';

export const getGridCoords = (position: number, color: PlayerColor, homeIndex: number): { x: number, y: number } => {
  // Handle pieces in Home Yard
  if (position < 0) {
    const offsets = [
      { x: 1, y: 1 }, { x: 4, y: 1 },
      { x: 1, y: 4 }, { x: 4, y: 4 }
    ];
    const base = {
      red: { x: 0, y: 0 },
      green: { x: 9, y: 0 },
      yellow: { x: 9, y: 9 },
      blue: { x: 0, y: 9 }
    }[color];
    return { x: base.x + offsets[homeIndex].x, y: base.y + offsets[homeIndex].y };
  }

  // Handle piece at Home Center (Winner)
  if (position === 58) return { x: 7, y: 7 };

  // Handle Home Stretch (52-57)
  if (position >= 52) {
    const step = position - 51;
    switch (color) {
      case 'red': return { x: step, y: 7 };
      case 'green': return { x: 7, y: step };
      case 'yellow': return { x: 14 - step, y: 7 };
      case 'blue': return { x: 7, y: 14 - step };
    }
  }

  // Handle Common Track (0-51)
  // A complex mapping is usually used for Ludo grids, here's a simplified mapping function
  const track = [
    [6,13], [6,12], [6,11], [6,10], [6,9], // Bottom of Green/Red
    [5,8], [4,8], [3,8], [2,8], [1,8], [0,8], // Left Path
    [0,7], [0,6], // Far Left
    [1,6], [2,6], [3,6], [4,6], [5,6], // Left Middle
    [6,5], [6,4], [6,3], [6,2], [6,1], [6,0], // Top Left
    [7,0], [8,0], // Far Top
    [8,1], [8,2], [8,3], [8,4], [8,5], // Top Middle
    [9,6], [10,6], [11,6], [12,6], [13,6], [14,6], // Right Path
    [14,7], [14,8], // Far Right
    [13,8], [12,8], [11,8], [10,8], [9,8], // Right Middle
    [8,9], [8,10], [8,11], [8,12], [8,13], [8,14], // Bottom Right
    [7,14], [6,14] // Far Bottom
  ];
  
  const coords = track[position % 52];
  return { x: coords[0], y: coords[1] };
};