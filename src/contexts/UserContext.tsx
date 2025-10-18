"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface User {
  id: string
  username: string
  email: string
  level: number
  totalScore: number
  coins: number
  lives: number
  lastLifeRefill: number
  completedLevels: number[]
  achievements: string[]
  dailyRewardStreak: number
  lastDailyReward: string
}

interface UserContextType {
  user: User | null
  signIn: (username: string, email: string) => void
  signOut: () => void
  updateUser: (updates: Partial<User>) => void
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => boolean
  refillLives: () => void
  completeLevel: (levelId: number, score: number, stars: number) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("breakfast-blitz-user")
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)

        // Check if lives need refilling (every 30 minutes)
        const now = Date.now()
        const timeSinceLastRefill = now - userData.lastLifeRefill
        const livesToAdd = Math.floor(timeSinceLastRefill / (30 * 60 * 1000))

        if (livesToAdd > 0 && userData.lives < 5) {
          const newLives = Math.min(5, userData.lives + livesToAdd)
          updateUser({ lives: newLives, lastLifeRefill: now })
        }
      }
    } catch (error) {
      console.error("Error loading user:", error)
    }
  }

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem("breakfast-blitz-user", JSON.stringify(userData))
    } catch (error) {
      console.error("Error saving user:", error)
    }
  }

  const signIn = (username: string, email: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      level: 1,
      totalScore: 0,
      coins: 100,
      lives: 5,
      lastLifeRefill: Date.now(),
      completedLevels: [],
      achievements: [],
      dailyRewardStreak: 0,
      lastDailyReward: "",
    }
    setUser(newUser)
    saveUser(newUser)
  }

  const signOut = async () => {
    setUser(null)
    await AsyncStorage.removeItem("breakfast-blitz-user")
  }

  const updateUser = (updates: Partial<User>) => {
    if (!user) return
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    saveUser(updatedUser)
  }

  const addCoins = (amount: number) => {
    if (!user) return
    updateUser({ coins: user.coins + amount })
  }

  const spendCoins = (amount: number): boolean => {
    if (!user || user.coins < amount) return false
    updateUser({ coins: user.coins - amount })
    return true
  }

  const refillLives = () => {
    if (!user) return
    updateUser({ lives: 5, lastLifeRefill: Date.now() })
  }

  const completeLevel = (levelId: number, score: number, stars: number) => {
    if (!user) return

    const newCompletedLevels = [...user.completedLevels]
    if (!newCompletedLevels.includes(levelId)) {
      newCompletedLevels.push(levelId)
    }

    const coinsEarned = stars * 10 + Math.floor(score / 1000)

    updateUser({
      completedLevels: newCompletedLevels,
      totalScore: user.totalScore + score,
      coins: user.coins + coinsEarned,
      level: Math.max(user.level, levelId + 1),
    })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        signIn,
        signOut,
        updateUser,
        addCoins,
        spendCoins,
        refillLives,
        completeLevel,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}
