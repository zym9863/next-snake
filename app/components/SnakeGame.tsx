'use client';

import React, { useState, useEffect } from 'react';
import useSnakeGame from '../hooks/useSnakeGame';
import { GameStatus, BOARD_SIZE } from '../types/game';

const SnakeGame: React.FC = () => {
  const { gameState, startGame, pauseGame, resetGame } = useSnakeGame();
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [prevScore, setPrevScore] = useState(0);

  useEffect(() => {
    if (gameState.score > prevScore) {
      setScoreAnimation(true);
      setTimeout(() => setScoreAnimation(false), 300);
    }
    setPrevScore(gameState.score);
  }, [gameState.score, prevScore]);

  const renderCell = (x: number, y: number) => {
    const isSnakeHead = gameState.snake[0]?.x === x && gameState.snake[0]?.y === y;
    const isSnakeBody = gameState.snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = gameState.food.x === x && gameState.food.y === y;

    let cellClass = 'w-5 h-5 transition-all duration-200 ease-in-out';

    if (isSnakeHead) {
      cellClass += ' snake-head rounded-lg';
    } else if (isSnakeBody) {
      const segmentIndex = gameState.snake.slice(1).findIndex(segment => segment.x === x && segment.y === y);
      const totalSegments = gameState.snake.length - 1;
      const opacity = 1 - (segmentIndex / totalSegments) * 0.3;
      cellClass += ` snake-body rounded-md`;
      return (
        <div
          key={`${x}-${y}`}
          className={cellClass}
          style={{ opacity }}
        />
      );
    } else if (isFood) {
      cellClass += ' food-cell rounded-full';
    } else {
      cellClass += ' bg-transparent';
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-2xl w-full slide-in-animation">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          贪吃蛇游戏
        </h1>
        
        {/* 游戏状态和分数 */}
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="text-xl font-bold text-slate-700">
            分数: <span className={`text-blue-600 ${scoreAnimation ? 'score-animation' : ''}`}>
              {gameState.score}
            </span>
          </div>
          <div className="text-xl font-bold text-slate-700">
            状态: <span className="text-emerald-600">{getStatusText()}</span>
          </div>
        </div>

        {/* 游戏画布 */}
        <div className="flex justify-center mb-8">
          <div 
            className="game-board p-4"
            style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
              gridTemplateRows: `repeat(${BOARD_SIZE}, 20px)`,
              gap: '1px'
            }}
          >
            {Array.from({ length: BOARD_SIZE }, (_, y) =>
              Array.from({ length: BOARD_SIZE }, (_, x) => renderCell(x, y))
            )}
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          {gameState.status === GameStatus.WAITING && (
            <button
              onClick={startGame}
              className="game-button px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transform hover:-translate-y-0.5"
            >
              开始游戏
            </button>
          )}
          
          {(gameState.status === GameStatus.PLAYING || gameState.status === GameStatus.PAUSED) && (
            <button
              onClick={pauseGame}
              className="game-button px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-600 transform hover:-translate-y-0.5"
            >
              {gameState.status === GameStatus.PLAYING ? '暂停' : '继续'}
            </button>
          )}
          
          <button
            onClick={resetGame}
            className="game-button px-8 py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-rose-600 hover:to-red-600 transform hover:-translate-y-0.5"
          >
            重新开始
          </button>
        </div>

        {/* 游戏说明 */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
          <h3 className="text-xl font-bold mb-4 text-slate-800">游戏说明:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
            {getInstructions().map((instruction, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full flex-shrink-0"></div>
                <span>{instruction}</span>
              </div>
            ))}
          </div>
        </div>

        {gameState.status === GameStatus.GAME_OVER && (
          <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl text-center game-over-animation">
            <p className="text-2xl font-bold text-red-700 mb-2">🎮 游戏结束！</p>
            <p className="text-xl text-red-600 mb-3">最终得分: <span className="font-bold">{gameState.score}</span></p>
            <p className="text-sm text-red-500">按 R 键或点击"重新开始"按钮重新游戏</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;