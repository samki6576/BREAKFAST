"use client"

import { useState, useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GameProvider } from "./src/contexts/GameContext"
import { UserProvider } from "./src/contexts/UserContext"
import { LeaderboardProvider } from "./src/contexts/LeaderboardContext"
import { LevelSystemProvider } from "./src/contexts/LevelSystem"
import { PurchaseManager } from "./src/utils/PurchaseManager"
import MainMenu from "./src/screens/MainMenu"
import GameScreen from "./src/screens/GameScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import LeaderboardScreen from "./src/screens/LeaderboardScreen"

import ShopScreen from "./src/screens/ShopScreen"
import PremiumShopScreen from "./src/screens/PremiumShopScreen"
import WorldMapScreen from "./src/screens/WorldMapScreen"
import { SoundManager } from "./src/utils/SoundManager"

export type Screen = "menu" | "game" | "profile" | "leaderboard" | "shop" | "premium" | "worldmap"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("menu")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize app systems
    const initApp = async () => {
      await Promise.all([SoundManager.init(), PurchaseManager.initialize()])
      setIsLoading(false)

      // Start menu music
      SoundManager.playMusic("menu")
    }

    initApp()

    // Clean up on app exit
    return () => {
      SoundManager.unload()
      PurchaseManager.disconnect()
    }
  }, [])

  // Handle screen changes and update music
  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen)

    // Play appropriate music for each screen
    switch (screen) {
      case "menu":
        SoundManager.playMusic("menu")
        break
      case "game":
        SoundManager.playMusic("gameplay")
        break
      case "shop":
      case "premium":
        SoundManager.playMusic("shop")
        break
      default:
        // Keep current music for other screens
        break
    }

    // Play button click sound
    SoundManager.playSound("button_click")
  }

  if (isLoading) {
    // You could show a splash screen here
    return null
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <LevelSystemProvider>
          <LeaderboardProvider>
            <GameProvider>
              <StatusBar style="light" backgroundColor="#92400e" />
              {currentScreen === "menu" && <MainMenu onNavigate={handleNavigate} />}
              {currentScreen === "game" && <GameScreen onNavigate={handleNavigate} />}
              {currentScreen === "profile" && <ProfileScreen onNavigate={handleNavigate} />}
              {currentScreen === "leaderboard" && <LeaderboardScreen onNavigate={handleNavigate} />}
            
              {currentScreen === "shop" && <ShopScreen onNavigate={handleNavigate} />}
              {currentScreen === "premium" && <PremiumShopScreen onNavigate={handleNavigate} />}
              {currentScreen === "worldmap" && <WorldMapScreen onNavigate={handleNavigate} />}
            </GameProvider>
          </LeaderboardProvider>
        </LevelSystemProvider>
      </UserProvider>
    </SafeAreaProvider>
  )
}
