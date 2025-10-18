"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
    // Load user from localStorage
    const savedUser = localStorage.getItem("breakfast-blitz-user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)

      // Check if lives need refilling (every 30 minutes)
      const now = Date.now()
      const timeSinceLastRefill = now - userData.lastLifeRefill
      const livesToAdd = Math.floor(timeSinceLastRefill / (30 * 60 * 1000)) // 30 minutes per life

      if (livesToAdd > 0 && userData.lives < 5) {
        const newLives = Math.min(5, userData.lives + livesToAdd)
        updateUser({ lives: newLives, lastLifeRefill: now })
      }
    }
  }, [])

  const signIn = (username: string, email: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      level: 1,
      totalScore: 0,
      coins: 100, // Starting coins
      lives: 5,
      lastLifeRefill: Date.now(),
      completedLevels: [],
      achievements: [],
      dailyRewardStreak: 0,
      lastDailyReward: "",
    }
    setUser(newUser)
    localStorage.setItem("breakfast-blitz-user", JSON.stringify(newUser))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("breakfast-blitz-user")
  }

  const updateUser = (updates: Partial<User>) => {
    if (!user) return
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem("breakfast-blitz-user", JSON.stringify(updatedUser))
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
