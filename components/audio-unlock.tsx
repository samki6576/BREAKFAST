"use client"

import { useEffect, useRef } from "react"
import { useSettings } from "@/contexts/settings-context"

export default function AudioUnlock() {
  const unlockedRef = useRef(false)
  const { soundEnabled, soundVolume } = useSettings()

  useEffect(() => {
    const unlock = async () => {
      if (unlockedRef.current) return
      try {
        const a = new Audio("/click.mp3")
        a.volume = Math.max(0.0001, soundEnabled ? soundVolume / 100 : 0)
        await a.play().catch(() => {})
        a.pause()
        a.currentTime = 0
        unlockedRef.current = true
      } catch {}
    }

    const onFirstInteract = () => {
      unlock()
      window.removeEventListener("pointerdown", onFirstInteract)
      window.removeEventListener("keydown", onFirstInteract)
      window.removeEventListener("touchstart", onFirstInteract)
    }

    window.addEventListener("pointerdown", onFirstInteract, { once: true })
    window.addEventListener("keydown", onFirstInteract, { once: true })
    window.addEventListener("touchstart", onFirstInteract, { once: true })

    return () => {
      window.removeEventListener("pointerdown", onFirstInteract)
      window.removeEventListener("keydown", onFirstInteract)
      window.removeEventListener("touchstart", onFirstInteract)
    }
  }, [soundEnabled, soundVolume])

  return null
}


