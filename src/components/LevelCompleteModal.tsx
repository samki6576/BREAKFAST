import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useState } from "react"
import ParticleSystem from "./ParticleSystem"
import { SoundManager } from "../utils/SoundManager"
import type { Level } from "../contexts/GameContext"

interface LevelCompleteModalProps {
  visible: boolean
  level: Level
  score: number
  stars: number
  onNextLevel: () => void
  onRetry: () => void
}

export default function LevelCompleteModal({
  visible,
  level,
  score,
  stars,
  onNextLevel,
  onRetry,
}: LevelCompleteModalProps) {
  const [particleTrigger, setParticleTrigger] = useState(false)

  useEffect(() => {
    if (visible) {
      // trigger particles
      setParticleTrigger(true)
      // play victory sound (fire-and-forget)
      SoundManager.playSound("level_complete")
      // play short victory music if music enabled
      SoundManager.playMusic("victory").catch(() => {})
      // reset trigger after a short delay so re-opening retriggers
      const t = setTimeout(() => setParticleTrigger(false), 2000)
      const musicStop = setTimeout(() => {
        // stop victory music after 4 seconds to return to gameplay music
        SoundManager.playMusic("gameplay").catch(() => {})
      }, 4000)
      return () => clearTimeout(t)
    }
  }, [visible])

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient colors={["#fef3c7", "#fde68a"]} style={styles.modalContainer}>
          <Text style={styles.celebration}>🎉</Text>
          <Text style={styles.title}>Level Complete!</Text>
          <Text style={styles.levelName}>{level.name}</Text>

          {/* Particle celebration */}
          <ParticleSystem trigger={particleTrigger} type="levelComplete" />

          <View style={styles.starsContainer}>
            {[1, 2, 3].map((star) => (
              <Text key={star} style={[styles.star, { opacity: stars >= star ? 1 : 0.3 }]}>
                ⭐
              </Text>
            ))}
          </View>

          <View style={styles.scoreContainer}>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Score:</Text>
              <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Target:</Text>
              <Text style={styles.scoreValue}>{level.targetScore.toLocaleString()}</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Coins Earned:</Text>
              <Text style={styles.scoreValue}>+{stars * 10 + Math.floor(score / 1000)}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
              <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>🔄 Retry</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={onNextLevel} activeOpacity={0.8}>
              <LinearGradient colors={["#f59e0b", "#d97706"]} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Next Level ➡️</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 30,
    borderWidth: 4,
    borderColor: "#fbbf24",
    alignItems: "center",
  },
  celebration: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 10,
  },
  levelName: {
    fontSize: 16,
    color: "#b45309",
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },
  star: {
    fontSize: 32,
  },
  scoreContainer: {
    backgroundColor: "#fef3c7",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    marginBottom: 25,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#92400e",
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
  },
  button: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
  },
})
