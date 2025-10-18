"use client"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { useGame, LEVELS } from "../contexts/GameContext"
import { useUser } from "../contexts/UserContext"
import { SoundManager } from "../utils/SoundManager"
import type { Screen } from "../../App"
import GameBoard from "../components/GameBoard"
import PowerUpBar from "../components/PowerUpBar"
import LevelCompleteModal from "../components/LevelCompleteModal"
import GameOverModal from "../components/GameOverModal"
import ParticleSystem from "../components/ParticleSystem"

const { width } = Dimensions.get("window")

interface GameScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function GameScreen({ onNavigate }: GameScreenProps) {
  const { gameState, initializeLevel, pauseGame, resumeGame, resetGame } = useGame()
  const { user, updateUser } = useUser()
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [particleType, setParticleType] = useState<"match" | "powerup" | "levelComplete">("match")

  useEffect(() => {
    if (!user) {
      onNavigate("menu")
      return
    }

    // Initialize the first level or user's current level
    const currentLevelId = Math.min(user.level, LEVELS.length)
    const level = LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0]
    initializeLevel(level)
  }, [user])

  useEffect(() => {
    if (gameState.gameStatus === "won") {
      // Play victory sound and show particles
      SoundManager.playSound("level_complete")
      setParticleType("levelComplete")
      setShowParticles(true)
      setShowLevelComplete(true)
    } else if (gameState.gameStatus === "lost") {
      // Play defeat sound
      SoundManager.playSound("level_failed")
      setShowGameOver(true)
    }
  }, [gameState.gameStatus])

  const handlePause = () => {
    SoundManager.playSound("button_click")
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

  const handleNextLevel = () => {
    if (!user) return

    SoundManager.playSound("button_click")
    const stars = calculateStars()
    const nextLevelId = gameState.currentLevel.id + 1
    const nextLevel = LEVELS.find((l) => l.id === nextLevelId)

    // Complete current level
    user.completeLevel(gameState.currentLevel.id, gameState.score, stars)

    if (nextLevel) {
      initializeLevel(nextLevel)
    } else {
      // All levels completed
      onNavigate("menu")
    }

    setShowLevelComplete(false)
  }

  const handleRetry = () => {
    SoundManager.playSound("button_click")
    if (user && user.lives > 0) {
      updateUser({ lives: user.lives - 1 })
      resetGame()
      setShowGameOver(false)
    }
  }

  // Trigger match particles
  const triggerMatchParticles = () => {
    setParticleType("match")
    setShowParticles(true)
    setTimeout(() => setShowParticles(false), 100)
  }

  if (!user) {
    return null
  }

  return (
    <LinearGradient colors={["#fef3c7", "#fde68a"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => onNavigate("menu")}>
            <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.buttonGradient}>
              <Text style={styles.headerButtonText}>← Menu</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.levelInfo}>
            <Text style={styles.levelName}>{gameState.currentLevel.name}</Text>
            <Text style={styles.levelObjective}>{gameState.currentLevel.objective}</Text>
          </View>

          <TouchableOpacity style={styles.headerButton} onPress={handlePause}>
            <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.buttonGradient}>
              <Text style={styles.headerButtonText}>{gameState.gameStatus === "paused" ? "▶️" : "⏸️"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Game Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{gameState.score.toLocaleString()}</Text>
            <Text style={styles.statTarget}>Target: {gameState.currentLevel.targetScore.toLocaleString()}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statLabel}>Moves</Text>
            <Text style={styles.statValue}>{gameState.moves}</Text>
            <Text style={styles.statTarget}>Remaining</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statLabel}>Stars</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3].map((star) => (
                <Text key={star} style={[styles.star, { opacity: calculateStars() >= star ? 1 : 0.3 }]}>
                  ⭐
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Power-ups */}
        <PowerUpBar />

        {/* Game Board */}
        <View style={styles.gameContainer}>
          <GameBoard onMatch={triggerMatchParticles} />
          {showParticles && <ParticleSystem trigger={showParticles} type={particleType} />}
        </View>

        {/* Modals */}
        <LevelCompleteModal
          visible={showLevelComplete}
          level={gameState.currentLevel}
          score={gameState.score}
          stars={calculateStars()}
          onNextLevel={handleNextLevel}
          onRetry={() => {
            SoundManager.playSound("button_click")
            resetGame()
            setShowLevelComplete(false)
          }}
        />

        <GameOverModal
          visible={showGameOver}
          onRetry={handleRetry}
          onMenu={() => {
            SoundManager.playSound("button_click")
            onNavigate("menu")
          }}
          canRetry={user.lives > 0}
          livesRemaining={user.lives}
        />
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#92400e",
  },
  levelInfo: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
  },
  levelName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
    textAlign: "center",
  },
  levelObjective: {
    fontSize: 12,
    color: "#b45309",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(251, 191, 36, 0.3)",
    borderRadius: 15,
    padding: 12,
    alignItems: "center",
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
  },
  statTarget: {
    fontSize: 10,
    color: "#b45309",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    fontSize: 16,
  },
  gameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
