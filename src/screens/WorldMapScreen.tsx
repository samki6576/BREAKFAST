"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { useLevelSystem, type World, type LevelData } from "../contexts/LevelSystem"
import { useUser } from "../contexts/UserContext"
import { useGame } from "../contexts/GameContext"
import { SoundManager } from "../utils/SoundManager"
import type { Screen } from "../../App"

const { width, height } = Dimensions.get("window")

interface WorldMapScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function WorldMapScreen({ onNavigate }: WorldMapScreenProps) {
  const { worlds, getCurrentLevel, getWorldLevels, isLevelUnlocked } = useLevelSystem()
  const { user } = useUser()
  const { initializeLevel } = useGame()
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null)
  const [showLevelSelect, setShowLevelSelect] = useState(false)

  const handleWorldSelect = (world: World) => {
    if (user && user.level >= world.unlockLevel) {
      SoundManager.playSound("button_click")
      setSelectedWorld(world)
      setShowLevelSelect(true)
    } else {
      SoundManager.playSound("level_failed")
    }
  }

  const handleLevelSelect = (level: LevelData) => {
    if (user && isLevelUnlocked(level.id, user.level)) {
      SoundManager.playSound("button_click")
      initializeLevel(level)
      onNavigate("game")
    } else {
      SoundManager.playSound("level_failed")
    }
  }

  const getWorldProgress = (world: World) => {
    if (!user) return 0
    const worldLevels = getWorldLevels(world.id)
    const completedLevels = worldLevels.filter((level) => user.completedLevels.includes(level.id)).length
    return Math.floor((completedLevels / worldLevels.length) * 100)
  }

  const renderWorld = (world: World, index: number) => {
    const isUnlocked = user ? user.level >= world.unlockLevel : false
    const progress = getWorldProgress(world)
    const isCompleted = progress === 100

    return (
      <TouchableOpacity
        key={world.id}
        style={[styles.worldCard, !isUnlocked && styles.lockedWorld]}
        onPress={() => handleWorldSelect(world)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isCompleted ? ["#10b981", "#059669"] : isUnlocked ? ["#fbbf24", "#f59e0b"] : ["#6b7280", "#4b5563"]}
          style={styles.worldGradient}
        >
          <View style={styles.worldHeader}>
            <Text style={styles.worldIcon}>{isUnlocked ? world.icon : "🔒"}</Text>
            <View style={styles.worldInfo}>
              <Text style={[styles.worldName, !isUnlocked && styles.lockedText]}>{world.name}</Text>
              <Text style={[styles.worldDescription, !isUnlocked && styles.lockedText]}>
                {isUnlocked ? world.description : `Unlock at level ${world.unlockLevel}`}
              </Text>
            </View>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>✓</Text>
              </View>
            )}
          </View>

          <View style={styles.worldStats}>
            <Text style={[styles.levelRange, !isUnlocked && styles.lockedText]}>
              Levels {world.levelRange.start}-{world.levelRange.end}
            </Text>
            {isUnlocked && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{progress}%</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  const renderLevel = ({ item: level }: { item: LevelData }) => {
    const isUnlocked = user ? isLevelUnlocked(level.id, user.level) : false
    const isCompleted = user ? user.completedLevels.includes(level.id) : false
    const isCurrent = user ? user.level === level.id : false

    const getDifficultyColor = (difficulty: LevelData["difficulty"]) => {
      switch (difficulty) {
        case "easy":
          return ["#10b981", "#059669"]
        case "medium":
          return ["#f59e0b", "#d97706"]
        case "hard":
          return ["#dc2626", "#b91c1c"]
        case "expert":
          return ["#8b5cf6", "#7c3aed"]
        case "legendary":
          return ["#1f2937", "#111827"]
        default:
          return ["#6b7280", "#4b5563"]
      }
    }

    return (
      <TouchableOpacity
        style={[styles.levelCard, !isUnlocked && styles.lockedLevel]}
        onPress={() => handleLevelSelect(level)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isUnlocked ? getDifficultyColor(level.difficulty) : ["#9ca3af", "#6b7280"]}
          style={styles.levelGradient}
        >
          <View style={styles.levelHeader}>
            <Text style={styles.levelNumber}>{isUnlocked ? level.id : "🔒"}</Text>
            {isCompleted && <Text style={styles.levelCompleted}>⭐</Text>}
            {isCurrent && <Text style={styles.levelCurrent}>👑</Text>}
          </View>

          <Text style={[styles.levelName, !isUnlocked && styles.lockedText]}>
            {isUnlocked ? `Stage ${level.id - level.worldId * 50 + 50}` : "Locked"}
          </Text>

          {isUnlocked && (
            <>
              <Text style={styles.levelObjective}>{level.objective}</Text>
              <View style={styles.levelDetails}>
                <Text style={styles.levelMoves}>🎯 {level.moves} moves</Text>
                <Text style={styles.levelDifficulty}>
                  {level.difficulty.charAt(0).toUpperCase() + level.difficulty.slice(1)}
                </Text>
              </View>

              {level.specialFeatures.length > 0 && (
                <View style={styles.specialFeatures}>
                  {level.specialFeatures.includes("boss-level") && <Text style={styles.featureBadge}>👹 Boss</Text>}
                  {level.specialFeatures.includes("mega-rewards") && <Text style={styles.featureBadge}>💎 Mega</Text>}
                  {level.specialFeatures.includes("world-finale") && <Text style={styles.featureBadge}>🏆 Finale</Text>}
                </View>
              )}
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  if (showLevelSelect && selectedWorld) {
    const worldLevels = getWorldLevels(selectedWorld.id)

    return (
      <LinearGradient colors={["#fef3c7", "#fde68a"]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setShowLevelSelect(false)
                setSelectedWorld(null)
                SoundManager.playSound("button_click")
              }}
            >
              <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.buttonGradient}>
                <Text style={styles.backButtonText}>← Back</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.worldHeader}>
              <Text style={styles.selectedWorldIcon}>{selectedWorld.icon}</Text>
              <Text style={styles.selectedWorldName}>{selectedWorld.name}</Text>
            </View>

            <View style={styles.worldProgress}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressValue}>{getWorldProgress(selectedWorld)}%</Text>
            </View>
          </View>

          <FlatList
            data={worldLevels}
            renderItem={renderLevel}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            contentContainerStyle={styles.levelGrid}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={["#fef3c7", "#fde68a"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => onNavigate("menu")}>
            <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.buttonGradient}>
              <Text style={styles.backButtonText}>← Menu</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>World Map</Text>

          <View style={styles.totalProgress}>
            <Text style={styles.totalProgressLabel}>Overall</Text>
            <Text style={styles.totalProgressValue}>
              {user ? Math.floor((user.completedLevels.length / 1000) * 100) : 0}%
            </Text>
          </View>
        </View>

        <ScrollView style={styles.worldList} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>🌍 Breakfast Worlds</Text>
          <Text style={styles.sectionSubtitle}>Explore 20 unique worlds with 1000 challenging levels!</Text>

          {worlds.map((world, index) => renderWorld(world, index))}

          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>🏆 Your Journey</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{user?.completedLevels.length || 0}</Text>
                <Text style={styles.statLabel}>Levels Completed</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{user?.level || 1}</Text>
                <Text style={styles.statLabel}>Current Level</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {worlds.filter((w) => (user ? user.level >= w.unlockLevel : false)).length}
                </Text>
                <Text style={styles.statLabel}>Worlds Unlocked</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{user?.totalScore.toLocaleString() || 0}</Text>
                <Text style={styles.statLabel}>Total Score</Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  backButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#92400e",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#92400e",
  },
  totalProgress: {
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  totalProgressLabel: {
    fontSize: 10,
    color: "#b45309",
  },
  totalProgressValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
  },
  worldList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#b45309",
    marginBottom: 20,
  },
  worldCard: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lockedWorld: {
    opacity: 0.7,
  },
  worldGradient: {
    padding: 20,
  },
  worldHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  worldIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  worldInfo: {
    flex: 1,
  },
  worldName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  worldDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  lockedText: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  completedBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  completedText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  worldStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelRange: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBar: {
    width: 100,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  selectedWorldIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  selectedWorldName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
  },
  worldProgress: {
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  progressLabel: {
    fontSize: 10,
    color: "#b45309",
  },
  progressValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
  },
  levelGrid: {
    padding: 10,
  },
  levelCard: {
    flex: 1,
    margin: 5,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lockedLevel: {
    opacity: 0.6,
  },
  levelGradient: {
    padding: 12,
    minHeight: 120,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  levelCompleted: {
    fontSize: 16,
  },
  levelCurrent: {
    fontSize: 16,
  },
  levelName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  levelObjective: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  levelDetails: {
    marginBottom: 8,
  },
  levelMoves: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 2,
  },
  levelDifficulty: {
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.7)",
    textTransform: "uppercase",
  },
  specialFeatures: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  featureBadge: {
    fontSize: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    color: "white",
  },
  statsContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 15,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 60) / 2,
    backgroundColor: "rgba(251, 191, 36, 0.3)",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#b45309",
    textAlign: "center",
  },
})
