"use client"

import { useState } from "react"
import { GameProvider } from "@/contexts/game-context"
import { UserProvider } from "@/contexts/user-context"
import { SettingsProvider } from "@/contexts/settings-context"
import MainMenu from "@/components/main-menu"
import GameScreen from "@/components/game-screen"
import ProfileScreen from "@/components/profile-screen"
import LeaderboardScreen from "@/components/leaderboard-screen"
import AudioUnlock from "@/components/audio-unlock"

import ShopScreen from "@/components/shop-screen"

export type Screen = "menu" | "game" | "profile" | "leaderboard" | "shop"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("menu")
  // Register service worker
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    // fire-and-forget, no await
    navigator.serviceWorker.register("/sw.js").catch(() => {})
  }

  return (
    <UserProvider>
      <SettingsProvider>
        <GameProvider>
        <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
          <div className="container mx-auto px-4 py-8">
            <AudioUnlock />
            {currentScreen === "menu" && <MainMenu onNavigate={setCurrentScreen} />}
            {currentScreen === "game" && <GameScreen onNavigate={setCurrentScreen} />}
            {currentScreen === "profile" && <ProfileScreen onNavigate={setCurrentScreen} />}
            {currentScreen === "leaderboard" && <LeaderboardScreen onNavigate={setCurrentScreen} />}
            {currentScreen === "shop" && <ShopScreen onNavigate={setCurrentScreen} />}
          </div>
        </main>
        </GameProvider>
      </SettingsProvider>
    </UserProvider>
  )
}
