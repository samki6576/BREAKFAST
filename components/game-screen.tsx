"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Pause, Star, Target, Zap } from "lucide-react"
import { useGame, LEVELS } from "@/contexts/game-context"
import { useUser } from "@/contexts/user-context"
import type { Screen } from "@/app/page"
import GameBoard from "./game-board"
import PowerUpBar from "./power-up-bar"
import LevelCompleteModal from "./level-complete-modal"
import GameOverModal from "./game-over-modal"
import { track } from "@/lib/analytics"

export default function GameScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { gameState, initializeLevel, pauseGame, resumeGame, resetGame } = useGame()
  const { user, updateUser } = useUser()
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)

  useEffect(() => {
    track({ type: "session_start" })
    if (!user) {
      onNavigate("menu")
      return
    }

    // Initialize the first level or user's current level
    const currentLevelId = Math.min(user.level, LEVELS.length)
    const level = LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0]
    initializeLevel(level)
    track({ type: "level_start", levelId: level.id })
  }, [user])

  useEffect(() => {
    if (gameState.gameStatus === "won") {
      track({ type: "level_end", levelId: gameState.currentLevel.id, result: "won", score: gameState.score })
      setShowLevelComplete(true)
    } else if (gameState.gameStatus === "lost") {
      track({ type: "level_end", levelId: gameState.currentLevel.id, result: "lost", score: gameState.score })
      setShowGameOver(true)
    }
  }, [gameState.gameStatus])

  const handlePause = () => {
    if (gameState.gameStatus === "playing") {
      pauseGame()
    } else if (gameState.gameStatus === "paused") {
      resumeGame()
    }
  }

  const calculateStars = (): number => {
    const scoreRatio = gameState.score / gameState.currentLevel.targetScore
    if (scoreRatio >= 2) return 3
    if (scoreRatio >= 1.5) return 2
    if (scoreRatio >= 1) return 1
    return 0
  }

  function handleNextLevel() {
    if (!user) return;
    // Mark the current level as completed and increment the user's level
    updateUser({
      level: user.level + 1,
      completedLevels: Array.from(new Set([...(user.completedLevels || []), gameState.currentLevel.id])),
    });
    setShowLevelComplete(false);
    resetGame();
  }

  const handleRetry = () => {
    if (user && user.lives > 0) {
      updateUser({ lives: user.lives - 1 })
      resetGame()
      setShowGameOver(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onNavigate("menu")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-amber-300 to-amber-400 rounded-lg shadow-md text-amber-900 font-medium hover:brightness-105 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Menu
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-800">{gameState.currentLevel.name}</h1>
          <p className="text-amber-700">{gameState.currentLevel.objective}</p>
        </div>

        <button
          onClick={handlePause}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-amber-300 to-amber-400 rounded-lg shadow-md text-amber-900 font-medium hover:brightness-105 transition-all"
        >
          <Pause className="w-5 h-5" />
          {gameState.gameStatus === "paused" ? "Resume" : "Pause"}
        </button>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-b from-amber-100 to-amber-200 p-4 rounded-xl shadow-md text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-5 h-5 text-amber-800" />
            <span className="text-amber-800 font-bold">Score</span>
          </div>
          <p className="text-2xl font-bold text-amber-900">{gameState.score.toLocaleString()}</p>
          <p className="text-amber-700 text-sm">Target: {gameState.currentLevel.targetScore.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-b from-amber-100 to-amber-200 p-4 rounded-xl shadow-md text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-amber-800" />
            <span className="text-amber-800 font-bold">Moves</span>
          </div>
          <p className="text-2xl font-bold text-amber-900">{gameState.moves}</p>
          <p className="text-amber-700 text-sm">Remaining</p>
        </div>

        <div className="bg-gradient-to-b from-amber-100 to-amber-200 p-4 rounded-xl shadow-md text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-5 h-5 text-amber-800" />
            <span className="text-amber-800 font-bold">Stars</span>
          </div>
          <div className="flex justify-center gap-1">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${calculateStars() >= star ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Power-ups */}
      <PowerUpBar />

      {/* Game Board */}
      <div className="flex justify-center mb-6 relative">
        <GameBoard />
        {showTutorial && gameState.score === 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
            <div className="bg-white/95 p-4 rounded-xl shadow-md max-w-sm text-center">
              <div className="font-bold text-amber-800 mb-2">How to play</div>
              <div className="text-amber-700 text-sm mb-3">Tap a piece, then tap an adjacent one to swap. Make 3+ in a row!</div>
              <button
                onClick={() => setShowTutorial(false)}
                className="px-4 py-2 rounded-lg bg-gradient-to-b from-amber-400 to-amber-500 text-amber-900 font-bold"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showLevelComplete && (
        <LevelCompleteModal
          level={gameState.currentLevel}
          score={gameState.score}
          stars={calculateStars()}
          onNextLevel={handleNextLevel}
          onRetry={() => {
            resetGame()
            setShowLevelComplete(false)
          }}
        />
      )}

      {showGameOver && (
        <GameOverModal
          onRetry={handleRetry}
          onMenu={() => onNavigate("menu")}
          canRetry={user.lives > 0}
          livesRemaining={user.lives}
        />
      )}
    </div>
  )
}
