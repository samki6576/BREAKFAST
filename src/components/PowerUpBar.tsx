"use client"

import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useGame } from "../contexts/GameContext"
import { SoundManager } from "../utils/SoundManager"
import { useCallback } from "react"

const { width } = Dimensions.get("window")

export default function PowerUpBar() {
  const { gameState, usePowerUp } = useGame()

  const powerUps = [
    {
      key: "hammer" as const,
      icon: "🔨",
      name: "Hammer",
      count: gameState.powerUps.hammer,
      sound: "powerup_hammer",
    },
    {
      key: "baconBomb" as const,
      icon: "🥓",
      name: "Bacon Bomb",
      count: gameState.powerUps.baconBomb,
      sound: "powerup_baconbomb",
    },
    {
      key: "shuffle" as const,
      icon: "🔀",
      name: "Shuffle",
      count: gameState.powerUps.shuffle,
      sound: "powerup_shuffle",
    },
    {
      key: "mapleSyrup" as const,
      icon: "🍁",
      name: "Maple Syrup",
      count: gameState.powerUps.mapleSyrup,
      sound: "powerup_maplesyrup",
    },
    {
      key: "extraMoves" as const,
      icon: "➕",
      name: "+5 Moves",
      count: gameState.powerUps.extraMoves,
      sound: "powerup_coffee",
    },
    {
      key: "coffeeBoost" as const,
      icon: "☕",
      name: "Coffee Boost",
      count: gameState.powerUps.coffeeBoost,
      sound: "powerup_coffee",
    },
    {
      key: "colorBomb" as const,
      icon: "💣",
      name: "Color Bomb",
      count: gameState.powerUps.colorBomb,
      sound: "powerup_colorbomb",
    },
  ]

  const handlePowerUp = useCallback(
    (powerUpKey: string, soundKey: string) => {
      // Check if the power-up is available before proceeding
      if (gameState.gameStatus === "playing" && gameState.powerUps[powerUpKey] > 0) {
        // Play power-up sound
        SoundManager.playSound(soundKey as any)
        usePowerUp(powerUpKey)
      }
    },
    [usePowerUp, gameState],
  )

  return (
    <View style={styles.container}>
      {powerUps.map((powerUp) => (
        <TouchableOpacity
          key={powerUp.key}
          style={[styles.powerUpButton, powerUp.count <= 0 && styles.disabledButton]}
          onPress={() => handlePowerUp(powerUp.key, powerUp.sound)}
          disabled={powerUp.count <= 0 || gameState.gameStatus !== "playing"}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={powerUp.count > 0 ? ["#fbbf24", "#f59e0b"] : ["#d1d5db", "#9ca3af"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.powerUpIcon}>{powerUp.icon}</Text>
            <Text style={styles.powerUpName}>{powerUp.name}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{powerUp.count}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    paddingHorizontal: 5,
    flexWrap: "wrap",
    gap: 5,
  },
  powerUpButton: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: (width - 60) / 4,
    marginBottom: 5,
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    position: "relative",
  },
  powerUpIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  powerUpName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#92400e",
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  countBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#dc2626",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
})
