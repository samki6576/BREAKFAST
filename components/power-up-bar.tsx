"use client"

import { motion } from "framer-motion"
import { Hammer, Shuffle, Plus, Bomb } from "lucide-react"
import { useGame } from "@/contexts/game-context"
import { useCallback, useEffect, useRef } from "react"
import { useSettings } from "@/contexts/settings-context"

export default function PowerUpBar() {
  const { gameState, usePowerUp } = useGame()
  const { soundEnabled, soundVolume } = useSettings()
  const shuffleAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    try {
      shuffleAudioRef.current = new Audio("/click.mp3")
      if (shuffleAudioRef.current) shuffleAudioRef.current.volume = soundVolume / 100
    } catch {}
  }, [])

  useEffect(() => {
    if (shuffleAudioRef.current) shuffleAudioRef.current.volume = soundVolume / 100
    if (soundVolume === 0) {
      try {
        if (shuffleAudioRef.current) {
          shuffleAudioRef.current.pause()
          shuffleAudioRef.current.currentTime = 0
        }
      } catch {}
    }
  }, [soundVolume])

  // Stop any ongoing sound when sound is disabled
  useEffect(() => {
    if (!soundEnabled) {
      try {
        if (shuffleAudioRef.current) {
          shuffleAudioRef.current.pause()
          shuffleAudioRef.current.currentTime = 0
        }
      } catch {}
    }
  }, [soundEnabled])

  const powerUps = [
    {
      key: "hammer" as const,
      icon: <Hammer className="w-6 h-6" />,
      name: "Hammer",
      description: "Remove any piece",
      count: gameState.powerUps.hammer,
    },
    {
      key: "shuffle" as const,
      icon: <Shuffle className="w-6 h-6" />,
      name: "Shuffle",
      description: "Shuffle the board",
      count: gameState.powerUps.shuffle,
    },
    {
      key: "extraMoves" as const,
      icon: <Plus className="w-6 h-6" />,
      name: "+5 Moves",
      description: "Add 5 extra moves",
      count: gameState.powerUps.extraMoves,
    },
    {
      key: "colorBomb" as const,
      icon: <Bomb className="w-6 h-6" />,
      name: "Color Bomb",
      description: "Remove all pieces of one color",
      count: gameState.powerUps.colorBomb,
    },
  ]

  const handlePowerUp = useCallback((powerUpKey: keyof typeof gameState.powerUps) => {
    usePowerUp(powerUpKey)
    if (powerUpKey === "shuffle" && soundEnabled && soundVolume > 0 && shuffleAudioRef.current) {
      try {
        shuffleAudioRef.current.currentTime = 0
        shuffleAudioRef.current.play()
      } catch {}
    }
    // Haptic feedback on shuffle
    if (powerUpKey === "shuffle") {
      try {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate?.([15, 40, 15])
        }
      } catch {}
    }
  }, [usePowerUp, soundEnabled, soundVolume])

  return (
    <div className="flex justify-center gap-4 mb-6">
      {powerUps.map((powerUp) => (
        <motion.button
          key={powerUp.key}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePowerUp(powerUp.key)}
          disabled={powerUp.count <= 0 || gameState.gameStatus !== "playing"}
          className={`relative bg-gradient-to-b from-amber-300 to-amber-400 p-3 rounded-xl shadow-md text-amber-900 font-bold flex flex-col items-center gap-1 min-w-[80px] ${
            powerUp.count <= 0 ? "opacity-50 cursor-not-allowed" : "hover:brightness-105"
          }`}
        >
          {powerUp.icon}
          <span className="text-xs">{powerUp.name}</span>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {powerUp.count}
          </div>
        </motion.button>
      ))}
    </div>
  )
}
