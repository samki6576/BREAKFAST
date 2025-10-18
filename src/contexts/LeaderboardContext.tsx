"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface LeaderboardEntry {
  id: string
  username: string
  score: number
  level: number
  country: string
  avatar: string
  rank: number
  isCurrentUser?: boolean
  achievements: string[]
  totalPlayTime: number
  lastActive: number
}

export interface Tournament {
  id: string
  name: string
  description: string
  startTime: number
  endTime: number
  prize: string
  participants: number
  userRank?: number
  userScore?: number
  isActive: boolean
}

interface LeaderboardContextType {
  globalLeaderboard: LeaderboardEntry[]
  weeklyLeaderboard: LeaderboardEntry[]
  friendsLeaderboard: LeaderboardEntry[]
  tournaments: Tournament[]
  currentUserRank: number
  isLoading: boolean
  refreshLeaderboard: () => Promise<void>
  submitScore: (score: number, level: number) => Promise<void>
  addFriend: (friendId: string) => Promise<void>
  joinTournament: (tournamentId: string) => Promise<void>
  searchPlayer: (username: string) => Promise<LeaderboardEntry[]>
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined)

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([])
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([])
  const [friendsLeaderboard, setFriendsLeaderboard] = useState<LeaderboardEntry[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [currentUserRank, setCurrentUserRank] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Generate mock data for demonstration
  const generateMockLeaderboard = (): LeaderboardEntry[] => {
    const countries = ["🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇩🇪", "🇫🇷", "🇯🇵", "🇰🇷", "🇧🇷", "🇮🇳"]
    const avatars = ["🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🎓", "👨‍🎓", "👩‍🎓", "🧑‍🎨"]
    const achievements = ["🏆", "⭐", "🎯", "🔥", "💎", "👑", "🌟", "⚡", "💫", "🎊"]

    const names = [
      "PancakeMaster",
      "ToastQueen",
      "HoneyKing",
      "WaffleWizard",
      "ButterBoss",
      "SyrupSage",
      "BreakfastBeast",
      "MorningChamp",
      "CerealKiller",
      "BaconLord",
      "EggExpert",
      "MuffinMage",
      "CroissantCrush",
      "BagelsRule",
      "OatmealOG",
      "GranolaPro",
      "YogurtYoda",
      "FruitFanatic",
      "JuiceJedi",
      "CoffeeCraze",
      "TeaTime",
      "MilkMaster",
      "ChocolateChief",
      "VanillaVibe",
      "StrawberryStorm",
    ]

    return names
      .map((name, index) => ({
        id: `player-${index}`,
        username: name,
        score: Math.floor(Math.random() * 500000) + 50000,
        level: Math.floor(Math.random() * 100) + 1,
        country: countries[Math.floor(Math.random() * countries.length)],
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
        rank: index + 1,
        achievements: achievements.slice(0, Math.floor(Math.random() * 5) + 1),
        totalPlayTime: Math.floor(Math.random() * 10000) + 1000,
        lastActive: Date.now() - Math.floor(Math.random() * 86400000), // Within last 24 hours
      }))
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
  }

  const generateMockTournaments = (): Tournament[] => {
    const now = Date.now()
    return [
      {
        id: "weekly-championship",
        name: "Weekly Championship",
        description: "Compete for the weekly crown!",
        startTime: now - 86400000 * 2, // Started 2 days ago
        endTime: now + 86400000 * 5, // Ends in 5 days
        prize: "1000 Gems + Exclusive Badge",
        participants: 15847,
        userRank: 234,
        userScore: 45600,
        isActive: true,
      },
      {
        id: "breakfast-blitz",
        name: "Breakfast Blitz",
        description: "Speed challenge - most points in 1 hour!",
        startTime: now + 86400000, // Starts tomorrow
        endTime: now + 86400000 + 3600000, // 1 hour duration
        prize: "500 Gems + Power-up Bundle",
        participants: 0,
        isActive: false,
      },
      {
        id: "pancake-masters",
        name: "Pancake Masters",
        description: "Special pancake-themed levels only!",
        startTime: now + 86400000 * 3, // Starts in 3 days
        endTime: now + 86400000 * 10, // Lasts a week
        prize: "Exclusive Pancake Theme + 2000 Gems",
        participants: 0,
        isActive: false,
      },
    ]
  }

  useEffect(() => {
    loadLeaderboardData()
  }, [])

  const loadLeaderboardData = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be API calls
      const mockGlobal = generateMockLeaderboard()
      const mockWeekly = generateMockLeaderboard().slice(0, 50)
      const mockFriends = generateMockLeaderboard().slice(0, 10)
      const mockTournaments = generateMockTournaments()

      setGlobalLeaderboard(mockGlobal)
      setWeeklyLeaderboard(mockWeekly)
      setFriendsLeaderboard(mockFriends)
      setTournaments(mockTournaments)
      setCurrentUserRank(Math.floor(Math.random() * 1000) + 1)
    } catch (error) {
      console.error("Failed to load leaderboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshLeaderboard = async () => {
    await loadLeaderboardData()
  }

  const submitScore = async (score: number, level: number) => {
    try {
      // In a real app, this would submit to your backend
      console.log("Submitting score:", score, "Level:", level)

      // Update local leaderboards
      await refreshLeaderboard()
    } catch (error) {
      console.error("Failed to submit score:", error)
    }
  }

  const addFriend = async (friendId: string) => {
    try {
      // In a real app, this would add friend via API
      console.log("Adding friend:", friendId)
      await refreshLeaderboard()
    } catch (error) {
      console.error("Failed to add friend:", error)
    }
  }

  const joinTournament = async (tournamentId: string) => {
    try {
      // In a real app, this would join tournament via API
      console.log("Joining tournament:", tournamentId)

      setTournaments((prev) =>
        prev.map((tournament) =>
          tournament.id === tournamentId
            ? {
                ...tournament,
                participants: tournament.participants + 1,
                userRank: tournament.participants + 1,
                userScore: 0,
              }
            : tournament,
        ),
      )
    } catch (error) {
      console.error("Failed to join tournament:", error)
    }
  }

  const searchPlayer = async (username: string): Promise<LeaderboardEntry[]> => {
    try {
      // In a real app, this would search via API
      const results = globalLeaderboard
        .filter((player) => player.username.toLowerCase().includes(username.toLowerCase()))
        .slice(0, 10)

      return results
    } catch (error) {
      console.error("Failed to search players:", error)
      return []
    }
  }

  return (
    <LeaderboardContext.Provider
      value={{
        globalLeaderboard,
        weeklyLeaderboard,
        friendsLeaderboard,
        tournaments,
        currentUserRank,
        isLoading,
        refreshLeaderboard,
        submitScore,
        addFriend,
        joinTournament,
        searchPlayer,
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  )
}

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext)
  if (!context) {
    throw new Error("useLeaderboard must be used within LeaderboardProvider")
  }
  return context
}
