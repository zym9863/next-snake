export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export enum GameStatus {
  WAITING = 'WAITING',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  status: GameStatus;
  score: number;
  speed: number;
}

export const BOARD_SIZE = 20;
export const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

export const INITIAL_FOOD: Position = { x: 15, y: 10 };
export const INITIAL_DIRECTION = Direction.RIGHT;
export const INITIAL_SPEED = 150;