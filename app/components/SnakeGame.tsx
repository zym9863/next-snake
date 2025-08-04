'use client';

import React from 'react';
import useSnakeGame from '../hooks/useSnakeGame';
import { GameStatus, BOARD_SIZE } from '../types/game';

const SnakeGame: React.FC = () => {
  const { gameState, startGame, pauseGame, resetGame } = useSnakeGame();

  const renderCell = (x: number, y: number) => {
    const isSnakeHead = gameState.snake[0]?.x === x && gameState.snake[0]?.y === y;
    const isSnakeBody = gameState.snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = gameState.food.x === x && gameState.food.y === y;

    let cellClass = 'w-4 h-4 border border-gray-300';

    if (isSnakeHead) {
      cellClass += ' bg-green-600 rounded-sm';
    } else if (isSnakeBody) {
      cellClass += ' bg-green-400';
    } else if (isFood) {
      cellClass += ' bg-red-500 rounded-full';
    } else {
      cellClass += ' bg-gray-100';
    }

    return (
      <div
        key={`${x}-${y}`}
        className={cellClass}
      />
    );
  };

  const getStatusText = () => {
    switch (gameState.status) {
      case GameStatus.WAITING:
        return '按空格键开始游戏';
      case GameStatus.PLAYING:
        return '游戏进行中';
      case GameStatus.PAUSED:
        return '游戏已暂停';
      case GameStatus.GAME_OVER:
        return '游戏结束';
      default:
        return '';
    }
  };

  const getInstructions = () => {
    return [
      '使用方向键控制蛇的移动',
      '空格键：开始/暂停游戏',
      'R键：重新开始游戏',
      '吃掉红色食物获得分数'
    ];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          贪吃蛇游戏
        </h1>
        
        {/* 游戏状态和分数 */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-gray-700">
            分数: <span className="text-blue-600">{gameState.score}</span>
          </div>
          <div className="text-lg font-semibold text-gray-700">
            状态: <span className="text-green-600">{getStatusText()}</span>
          </div>
        </div>

        {/* 游戏画布 */}
        <div className="flex justify-center mb-6">
          <div 
            className="grid gap-0 border-2 border-gray-400 bg-white p-2"
            style={{ 
              gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: BOARD_SIZE }, (_, y) =>
              Array.from({ length: BOARD_SIZE }, (_, x) => renderCell(x, y))
            )}
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center gap-4 mb-6">
          {gameState.status === GameStatus.WAITING && (
            <button
              onClick={startGame}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              开始游戏
            </button>
          )}
          
          {(gameState.status === GameStatus.PLAYING || gameState.status === GameStatus.PAUSED) && (
            <button
              onClick={pauseGame}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              {gameState.status === GameStatus.PLAYING ? '暂停' : '继续'}
            </button>
          )}
          
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            重新开始
          </button>
        </div>

        {/* 游戏说明 */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">游戏说明:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {getInstructions().map((instruction, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                {instruction}
              </li>
            ))}
          </ul>
        </div>

        {gameState.status === GameStatus.GAME_OVER && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-center">
            <p className="text-red-700 font-semibold">游戏结束！</p>
            <p className="text-red-600">最终得分: {gameState.score}</p>
            <p className="text-sm text-red-500 mt-2">按 R 键或点击"重新开始"按钮重新游戏</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;