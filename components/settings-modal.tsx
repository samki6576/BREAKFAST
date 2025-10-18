"use client"

import { motion } from "framer-motion"
import { X, Volume2, Music, Vibrate } from "lucide-react"
import { useState, useRef, useEffect, useRef as useReactRef } from "react"
import { useSettings } from "@/contexts/settings-context"

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const {
    soundVolume,
    musicVolume,
    vibration,
    soundEnabled,
    musicEnabled,
    setSoundVolume,
    setMusicVolume,
    setVibration,
    setSoundEnabled,
    setMusicEnabled,
  } = useSettings()

  const clickSoundRef = useRef<HTMLAudioElement | null>(null)
  const musicRef = useRef<HTMLAudioElement | null>(null)
  const clickPreviewTimeout = useReactRef<number | null>(null)
  const [musicAvailable, setMusicAvailable] = useState<boolean>(true)

  // 🔹 Setup audio refs
  useEffect(() => {
    try {
      clickSoundRef.current = new Audio("/click.mp3")
      if (clickSoundRef.current) {
        clickSoundRef.current.volume = soundVolume / 100
      }
    } catch (error) {
      console.warn("Failed to initialize click sound", error)
    }
    // Probe for background music file
    ;(async () => {
      try {
        const res = await fetch("/background.mp3", { method: "HEAD" })
        setMusicAvailable(res.ok)
      } catch {
        setMusicAvailable(false)
      }
    })()
  }, [])

  // 🔹 Update music volume live
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = musicVolume / 100
    }
  }, [musicVolume])

  // 🔹 Update click volume live
  useEffect(() => {
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = soundVolume / 100
    }
  }, [soundVolume])

  // 🔹 Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const playClickSound = () => {
    if (!soundEnabled || soundVolume === 0) return
    if (clickSoundRef.current) {
      clickSoundRef.current.volume = soundVolume / 100
      clickSoundRef.current.currentTime = 0
      clickSoundRef.current.play().catch((err) => {
        console.log("Click sound blocked:", err)
      })
    }
  }

  const previewClickDebounced = () => {
    if (!soundEnabled || soundVolume === 0) return
    if (clickPreviewTimeout.current) return
    playClickSound()
    clickPreviewTimeout.current = window.setTimeout(() => {
      clickPreviewTimeout.current = null
    }, 120)
  }

  const startMusic = async () => {
    if (musicVolume === 0) return
    try {
      const res = await fetch("/background.mp3", { method: "HEAD" })
      if (!res.ok) {
        console.warn("/background.mp3 not found. Skipping music playback.")
        return
      }
      if (!musicRef.current) {
        musicRef.current = new Audio("/background.mp3")
        musicRef.current.loop = true
      }
      musicRef.current.volume = musicVolume / 100
      await musicRef.current.play()
    } catch (err) {
      console.log("Music play blocked or failed:", err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop click closes */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative z-10 bg-gradient-to-b from-amber-50 to-amber-100 p-6 rounded-2xl shadow-xl border-4 border-amber-300 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // prevent backdrop clicks
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-amber-800">Settings</h2>
          <button
            onClick={() => {
              playClickSound()
              onClose()
            }}
            className="p-2 rounded-full hover:bg-amber-200 transition-colors"
          >
            <X className="w-6 h-6 text-amber-800" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Sound Effects */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-amber-800" />
              <label className="text-lg font-medium text-amber-800">Sound Effects</label>
            </div>
            <div className="flex items-center gap-4">
              <label className="relative inline-flex items-center cursor-pointer mr-2">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={() => setSoundEnabled(!soundEnabled)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-amber-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolume}
                onChange={(e) => {
                  setSoundVolume(Number.parseInt(e.target.value))
                  previewClickDebounced()
                }}
                className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                disabled={!soundEnabled}
              />
              <span className="text-amber-800 font-medium w-8">{soundVolume}%</span>
            </div>
          </div>

          {/* Music */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Music className="w-6 h-6 text-amber-800" />
              <label className="text-lg font-medium text-amber-800">Music</label>
            </div>
            <div className="flex items-center gap-4">
              <label className="relative inline-flex items-center cursor-pointer mr-2">
                <input
                  type="checkbox"
                  checked={musicEnabled && musicAvailable}
                  onChange={() => {
                    if (!musicAvailable) return
                    const next = !musicEnabled
                    setMusicEnabled(next)
                    if (!next && musicRef.current) {
                      musicRef.current.pause()
                      musicRef.current.currentTime = 0
                    } else if (next) {
                      startMusic()
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-amber-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={(e) => setMusicVolume(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                disabled={!musicEnabled || !musicAvailable}
              />
              <span className="text-amber-800 font-medium w-8">{musicVolume}%</span>
            </div>
            {!musicAvailable && (
              <div className="text-amber-700 text-sm">
                Music file not found. Add /public/background.mp3.
              </div>
            )}
          </div>

          {/* Vibration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vibrate className="w-6 h-6 text-amber-800" />
              <label className="text-lg font-medium text-amber-800">Vibration</label>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={vibration}
                onChange={() => {
                  const next = !vibration
                  setVibration(next)
                  if (next && typeof navigator !== "undefined" && "vibrate" in navigator) {
                    try {
                      navigator.vibrate?.(30) // haptic feedback
                    } catch {}
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-amber-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-amber-200">
          <button
            onClick={() => {
              if (soundEnabled) playClickSound()
              if (musicEnabled && musicAvailable) startMusic()
              onClose()
            }}
            className="w-full bg-gradient-to-b from-amber-400 to-amber-500 px-4 py-3 rounded-xl shadow-md text-amber-900 font-bold text-lg hover:brightness-105 transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
