"use client"

import { createContext, useContext, type ReactNode } from "react"

export interface LevelData {
  id: number
  name: string
  world: string
  worldId: number
  objective: string
  targetScore: number
  moves: number
  obstacles: string[]
  difficulty: "easy" | "medium" | "hard" | "expert" | "legendary"
  specialFeatures: string[]
  rewards: {
    coins: number
    gems?: number
    powerUps?: Record<string, number>
  }
  unlockRequirement?: {
    type: "level" | "score" | "stars"
    value: number
  }
}

export interface World {
  id: number
  name: string
  theme: string
  description: string
  icon: string
  background: string
  levelRange: { start: number; end: number }
  unlockLevel: number
}

interface LevelSystemContextType {
  worlds: World[]
  levels: LevelData[]
  getCurrentLevel: (levelId: number) => LevelData | null
  getWorldLevels: (worldId: number) => LevelData[]
  isLevelUnlocked: (levelId: number, userLevel: number) => boolean
  getNextLevel: (currentLevelId: number) => LevelData | null
  generateLevel: (levelId: number) => LevelData
}

const LevelSystemContext = createContext<LevelSystemContextType | undefined>(undefined)

export function LevelSystemProvider({ children }: { children: ReactNode }) {
  // Define worlds (20 worlds with 50 levels each = 1000 levels)
  const worlds: World[] = [
    {
      id: 1,
      name: "Toast Town",
      theme: "breakfast-basics",
      description: "Learn the basics in this cozy breakfast village",
      icon: "🍞",
      background: "morning-kitchen",
      levelRange: { start: 1, end: 50 },
      unlockLevel: 1,
    },
    {
      id: 2,
      name: "Pancake Plains",
      theme: "fluffy-fields",
      description: "Wide open fields of golden pancakes",
      icon: "🥞",
      background: "golden-fields",
      levelRange: { start: 51, end: 100 },
      unlockLevel: 45,
    },
    {
      id: 3,
      name: "Butter Boulevard",
      theme: "creamy-streets",
      description: "Smooth streets paved with creamy butter",
      icon: "🧈",
      background: "butter-city",
      levelRange: { start: 101, end: 150 },
      unlockLevel: 95,
    },
    {
      id: 4,
      name: "Honey Hills",
      theme: "sweet-mountains",
      description: "Rolling hills dripping with golden honey",
      icon: "🍯",
      background: "honey-mountains",
      levelRange: { start: 151, end: 200 },
      unlockLevel: 145,
    },
    {
      id: 5,
      name: "Waffle Woods",
      theme: "crispy-forest",
      description: "Dense forest of crispy waffle trees",
      icon: "🧇",
      background: "waffle-forest",
      levelRange: { start: 201, end: 250 },
      unlockLevel: 195,
    },
    {
      id: 6,
      name: "Syrup Swamps",
      theme: "sticky-wetlands",
      description: "Mysterious swamps filled with maple syrup",
      icon: "🍁",
      background: "syrup-swamp",
      levelRange: { start: 251, end: 300 },
      unlockLevel: 245,
    },
    {
      id: 7,
      name: "Cereal City",
      theme: "crunchy-metropolis",
      description: "Bustling city made entirely of breakfast cereals",
      icon: "🥣",
      background: "cereal-city",
      levelRange: { start: 301, end: 350 },
      unlockLevel: 295,
    },
    {
      id: 8,
      name: "Bacon Beach",
      theme: "sizzling-shores",
      description: "Tropical beaches with sizzling bacon waves",
      icon: "🥓",
      background: "bacon-beach",
      levelRange: { start: 351, end: 400 },
      unlockLevel: 345,
    },
    {
      id: 9,
      name: "Egg Empire",
      theme: "golden-kingdom",
      description: "Majestic empire ruled by the Golden Egg",
      icon: "🥚",
      background: "egg-palace",
      levelRange: { start: 401, end: 450 },
      unlockLevel: 395,
    },
    {
      id: 10,
      name: "Muffin Mountains",
      theme: "baked-peaks",
      description: "Towering peaks of freshly baked muffins",
      icon: "🧁",
      background: "muffin-peaks",
      levelRange: { start: 451, end: 500 },
      unlockLevel: 445,
    },
    {
      id: 11,
      name: "Croissant Caves",
      theme: "flaky-caverns",
      description: "Underground caverns filled with buttery croissants",
      icon: "🥐",
      background: "croissant-caves",
      levelRange: { start: 501, end: 550 },
      unlockLevel: 495,
    },
    {
      id: 12,
      name: "Bagel Bridge",
      theme: "circular-crossing",
      description: "Ancient bridge connecting breakfast realms",
      icon: "🥯",
      background: "bagel-bridge",
      levelRange: { start: 551, end: 600 },
      unlockLevel: 545,
    },
    {
      id: 13,
      name: "Donut Dimension",
      theme: "glazed-portal",
      description: "Mystical dimension of infinite donuts",
      icon: "🍩",
      background: "donut-space",
      levelRange: { start: 601, end: 650 },
      unlockLevel: 595,
    },
    {
      id: 14,
      name: "Coffee Cosmos",
      theme: "caffeinated-space",
      description: "Cosmic realm powered by coffee energy",
      icon: "☕",
      background: "coffee-nebula",
      levelRange: { start: 651, end: 700 },
      unlockLevel: 645,
    },
    {
      id: 15,
      name: "Fruit Fortress",
      theme: "vitamin-stronghold",
      description: "Impenetrable fortress guarded by fresh fruits",
      icon: "🍓",
      background: "fruit-castle",
      levelRange: { start: 701, end: 750 },
      unlockLevel: 695,
    },
    {
      id: 16,
      name: "Yogurt Yards",
      theme: "creamy-gardens",
      description: "Serene gardens of flowing yogurt streams",
      icon: "🍦",
      background: "yogurt-garden",
      levelRange: { start: 751, end: 800 },
      unlockLevel: 745,
    },
    {
      id: 17,
      name: "Granola Galaxy",
      theme: "crunchy-cosmos",
      description: "Distant galaxy made of crunchy granola clusters",
      icon: "🌌",
      background: "granola-space",
      levelRange: { start: 801, end: 850 },
      unlockLevel: 795,
    },
    {
      id: 18,
      name: "Smoothie Station",
      theme: "blended-base",
      description: "High-tech station for creating perfect smoothies",
      icon: "🥤",
      background: "smoothie-lab",
      levelRange: { start: 851, end: 900 },
      unlockLevel: 845,
    },
    {
      id: 19,
      name: "Oatmeal Ocean",
      theme: "hearty-seas",
      description: "Vast ocean of warm, comforting oatmeal",
      icon: "🌊",
      background: "oatmeal-sea",
      levelRange: { start: 901, end: 950 },
      unlockLevel: 895,
    },
    {
      id: 20,
      name: "Breakfast Olympus",
      theme: "divine-summit",
      description: "The ultimate breakfast paradise where legends are made",
      icon: "⛰️",
      background: "olympus-peak",
      levelRange: { start: 951, end: 1000 },
      unlockLevel: 945,
    },
  ]

  const generateLevel = (levelId: number): LevelData => {
    const world = worlds.find((w) => levelId >= w.levelRange.start && levelId <= w.levelRange.end)!
    const levelInWorld = levelId - world.levelRange.start + 1

    // Calculate difficulty based on level progression
    const getDifficulty = (level: number): LevelData["difficulty"] => {
      if (level <= 200) return "easy"
      if (level <= 400) return "medium"
      if (level <= 600) return "hard"
      if (level <= 800) return "expert"
      return "legendary"
    }

    // Generate objectives based on level and world
    const getObjective = (level: number, worldTheme: string) => {
      const objectives = [
        `Score ${Math.floor(level * 100 + Math.random() * 500)} points`,
        `Collect ${Math.floor(level / 10) + 5} ${world.icon} pieces`,
        `Clear all obstacles in ${Math.floor(level / 20) + 15} moves`,
        `Create ${Math.floor(level / 50) + 2} special combos`,
        `Reach the bottom of the board`,
        `Collect ingredients for the perfect ${world.name.split(" ")[0].toLowerCase()}`,
      ]
      return objectives[level % objectives.length]
    }

    // Generate obstacles based on difficulty
    const getObstacles = (difficulty: LevelData["difficulty"]) => {
      const allObstacles = [
        "jelly",
        "chocolate",
        "licorice",
        "ice",
        "stone",
        "honey-trap",
        "burnt-toast",
        "sticky-syrup",
      ]
      const obstacleCount = {
        easy: 1,
        medium: 2,
        hard: 3,
        expert: 4,
        legendary: 5,
      }

      return allObstacles.slice(0, obstacleCount[difficulty])
    }

    // Generate special features
    const getSpecialFeatures = (level: number) => {
      const features = []
      if (level % 10 === 0) features.push("boss-level")
      if (level % 25 === 0) features.push("mega-rewards")
      if (level % 50 === 0) features.push("world-finale")
      if (level % 100 === 0) features.push("epic-challenge")
      if (level > 500) features.push("legendary-difficulty")
      if (level > 800) features.push("cosmic-powers")
      return features
    }

    const difficulty = getDifficulty(levelId)
    const baseScore = levelId * 150 + Math.floor(Math.random() * 300)
    const baseMoves = Math.max(10, 25 - Math.floor(levelId / 100))

    return {
      id: levelId,
      name: `${world.name} - Stage ${levelInWorld}`,
      world: world.name,
      worldId: world.id,
      objective: getObjective(levelId, world.theme),
      targetScore: baseScore,
      moves: baseMoves + Math.floor(Math.random() * 5),
      obstacles: getObstacles(difficulty),
      difficulty,
      specialFeatures: getSpecialFeatures(levelId),
  // story removed
      rewards: {
        coins: Math.floor(levelId * 2.5) + 50,
        gems: levelId % 10 === 0 ? Math.floor(levelId / 10) + 5 : undefined,
        powerUps:
          levelId % 25 === 0
            ? {
                hammer: 2,
                shuffle: 1,
                extraMoves: 1,
              }
            : undefined,
      },
      unlockRequirement:
        levelId > 1
          ? {
              type: "level",
              value: levelId - 1,
            }
          : undefined,
    }
  }

  // Generate all 1000 levels (we'll generate them on demand for performance)
  const levels: LevelData[] = []

  const getCurrentLevel = (levelId: number): LevelData | null => {
    if (levelId < 1 || levelId > 1000) return null

    // Check if level is already generated
    let level = levels.find((l) => l.id === levelId)
    if (!level) {
      level = generateLevel(levelId)
      levels.push(level)
    }

    return level
  }

  const getWorldLevels = (worldId: number): LevelData[] => {
    const world = worlds.find((w) => w.id === worldId)
    if (!world) return []

    const worldLevels: LevelData[] = []
    for (let i = world.levelRange.start; i <= world.levelRange.end; i++) {
      const level = getCurrentLevel(i)
      if (level) worldLevels.push(level)
    }

    return worldLevels
  }

  const isLevelUnlocked = (levelId: number, userLevel: number): boolean => {
    if (levelId === 1) return true

    const level = getCurrentLevel(levelId)
    if (!level?.unlockRequirement) return true

    switch (level.unlockRequirement.type) {
      case "level":
        return userLevel >= level.unlockRequirement.value
      default:
        return true
    }
  }

  const getNextLevel = (currentLevelId: number): LevelData | null => {
    if (currentLevelId >= 1000) return null
    return getCurrentLevel(currentLevelId + 1)
  }

  return (
    <LevelSystemContext.Provider
      value={{
        worlds,
        levels,
        getCurrentLevel,
        getWorldLevels,
        isLevelUnlocked,
        getNextLevel,
        generateLevel,
      }}
    >
      {children}
    </LevelSystemContext.Provider>
  )
}

export const useLevelSystem = () => {
  const context = useContext(LevelSystemContext)
  if (!context) {
    throw new Error("useLevelSystem must be used within LevelSystemProvider")
  }
  return context
}
