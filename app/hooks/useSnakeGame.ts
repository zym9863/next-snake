import { useState, useEffect, useCallback } from 'react';
import {
  Position,
  Direction,
  GameStatus,
  GameState,
  BOARD_SIZE,
  INITIAL_SNAKE,
  INITIAL_FOOD,
  INITIAL_DIRECTION,
  INITIAL_SPEED
} from '../types/game';

const useSnakeGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: INITIAL_FOOD,
    direction: INITIAL_DIRECTION,
    status: GameStatus.WAITING,
    score: 0,
    speed: INITIAL_SPEED
  });

  const generateFood = useCallback((snake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const moveSnake = useCallback((
    currentSnake: Position[],
    direction: Direction
  ): Position[] => {
    const head = { ...currentSnake[0] };

    switch (direction) {
      case Direction.UP:
        head.y -= 1;
        break;
      case Direction.DOWN:
        head.y += 1;
        break;
      case Direction.LEFT:
        head.x -= 1;
        break;
      case Direction.RIGHT:
        head.x += 1;
        break;
    }

    return [head, ...currentSnake.slice(0, -1)];
  }, []);

  const checkCollision = useCallback((head: Position, snake: Position[]): boolean => {
    // 检查边界碰撞
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      return true;
    }

    // 检查自身碰撞
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  const checkFoodEaten = useCallback((head: Position, food: Position): boolean => {
    return head.x === food.x && head.y === food.y;
  }, []);

  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prev => {
      // 防止反向移动
      const opposites = {
        [Direction.UP]: Direction.DOWN,
        [Direction.DOWN]: Direction.UP,
        [Direction.LEFT]: Direction.RIGHT,
        [Direction.RIGHT]: Direction.LEFT
      };

      if (prev.status === GameStatus.PLAYING && opposites[prev.direction] !== newDirection) {
        return { ...prev, direction: newDirection };
      }
      return prev;
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: GameStatus.PLAYING
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: prev.status === GameStatus.PLAYING ? GameStatus.PAUSED : GameStatus.PLAYING
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: INITIAL_FOOD,
      direction: INITIAL_DIRECTION,
      status: GameStatus.WAITING,
      score: 0,
      speed: INITIAL_SPEED
    });
  }, []);

  // 游戏主循环
  useEffect(() => {
    if (gameState.status !== GameStatus.PLAYING) return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        const newSnake = moveSnake(prev.snake, prev.direction);
        const head = newSnake[0];

        // 检查碰撞
        if (checkCollision(head, prev.snake)) {
          return {
            ...prev,
            status: GameStatus.GAME_OVER
          };
        }

        // 检查是否吃到食物
        if (checkFoodEaten(head, prev.food)) {
          const grownSnake = [...newSnake, prev.snake[prev.snake.length - 1]];
          const newFood = generateFood(grownSnake);
          const newScore = prev.score + 10;
          const newSpeed = Math.max(50, prev.speed - Math.floor(newScore / 100) * 10);

          return {
            ...prev,
            snake: grownSnake,
            food: newFood,
            score: newScore,
            speed: newSpeed
          };
        }

        return {
          ...prev,
          snake: newSnake
        };
      });
    }, gameState.speed);

    return () => clearInterval(gameLoop);
  }, [gameState.status, gameState.speed, moveSnake, checkCollision, checkFoodEaten, generateFood]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          changeDirection(Direction.UP);
          break;
        case 'ArrowDown':
          event.preventDefault();
          changeDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          changeDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
          event.preventDefault();
          changeDirection(Direction.RIGHT);
          break;
        case ' ':
          event.preventDefault();
          if (gameState.status === GameStatus.WAITING) {
            startGame();
          } else if (gameState.status === GameStatus.PLAYING || gameState.status === GameStatus.PAUSED) {
            pauseGame();
          }
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.status, changeDirection, startGame, pauseGame, resetGame]);

  return {
    gameState,
    startGame,
    pauseGame,
    resetGame,
    changeDirection
  };
};

export default useSnakeGame;