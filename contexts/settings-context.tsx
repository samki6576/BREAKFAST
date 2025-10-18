"use client"

import { createContext, useCallback, useContext, useMemo, useState, useEffect, ReactNode } from "react"

export type SettingsContextValue = {
  soundVolume: number
  musicVolume: number
  vibration: boolean
  soundEnabled: boolean
  musicEnabled: boolean
  setSoundVolume: (value: number) => void
  setMusicVolume: (value: number) => void
  setVibration: (value: boolean) => void
  setSoundEnabled: (value: boolean) => void
  setMusicEnabled: (value: boolean) => void
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [soundVolume, setSoundVolumeState] = useState<number>(() => {
    if (typeof window === "undefined") return 80
    const saved = localStorage.getItem("soundVolume")
    return saved ? Number(saved) : 80
  })
  const [musicVolume, setMusicVolumeState] = useState<number>(() => {
    if (typeof window === "undefined") return 60
    const saved = localStorage.getItem("musicVolume")
    return saved ? Number(saved) : 60
  })
  const [vibration, setVibrationState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true
    const saved = localStorage.getItem("vibration")
    return saved ? saved === "true" : true
  })
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true
    const saved = localStorage.getItem("soundEnabled")
    return saved ? saved === "true" : true
  })
  const [musicEnabled, setMusicEnabledState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true
    const saved = localStorage.getItem("musicEnabled")
    return saved ? saved === "true" : true
  })

  // Persist when values change
  useEffect(() => {
    try {
      localStorage.setItem("soundVolume", String(soundVolume))
    } catch {}
  }, [soundVolume])

  useEffect(() => {
    try {
      localStorage.setItem("musicVolume", String(musicVolume))
    } catch {}
  }, [musicVolume])

  useEffect(() => {
    try {
      localStorage.setItem("vibration", String(vibration))
    } catch {}
  }, [vibration])

  useEffect(() => {
    try {
      localStorage.setItem("soundEnabled", String(soundEnabled))
    } catch {}
  }, [soundEnabled])

  useEffect(() => {
    try {
      localStorage.setItem("musicEnabled", String(musicEnabled))
    } catch {}
  }, [musicEnabled])

  const setSoundVolume = useCallback((value: number) => {
    setSoundVolumeState(Math.max(0, Math.min(100, value)))
  }, [])

  const setMusicVolume = useCallback((value: number) => {
    setMusicVolumeState(Math.max(0, Math.min(100, value)))
  }, [])

  const setVibration = useCallback((value: boolean) => {
    setVibrationState(Boolean(value))
  }, [])

  const setSoundEnabled = useCallback((value: boolean) => {
    setSoundEnabledState(Boolean(value))
  }, [])

  const setMusicEnabled = useCallback((value: boolean) => {
    setMusicEnabledState(Boolean(value))
  }, [])

  const value = useMemo<SettingsContextValue>(() => ({
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
  }), [soundVolume, musicVolume, vibration, soundEnabled, musicEnabled, setSoundVolume, setMusicVolume, setVibration])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider")
  return ctx
}


