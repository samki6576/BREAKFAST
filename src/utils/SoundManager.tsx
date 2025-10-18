"use client"

import { Audio } from "expo-av"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Sound effect types
export type SoundEffectType =
  | "match3"
  | "match4"
  | "match5"
  | "powerup_hammer"
  | "powerup_shuffle"
  | "powerup_colorbomb"
  | "powerup_baconbomb"
  | "powerup_maplesyrup"
  | "powerup_coffee"
  | "level_complete"
  | "level_failed"
  | "button_click"
  | "obstacle_break"
  | "toast_match"
  | "pancake_match"
  | "honey_match"
  | "butter_match"
  | "waffle_match"
  | "syrup_match"

// Music tracks
export type MusicTrackType = "menu" | "gameplay" | "victory" | "shop"

class SoundManagerClass {
  private soundEffects: Record<SoundEffectType, Audio.Sound | null> = {
    match3: null,
    match4: null,
    match5: null,
    powerup_hammer: null,
    powerup_shuffle: null,
    powerup_colorbomb: null,
    powerup_baconbomb: null,
    powerup_maplesyrup: null,
    powerup_coffee: null,
    level_complete: null,
    level_failed: null,
    button_click: null,
    obstacle_break: null,
    toast_match: null,
    pancake_match: null,
    honey_match: null,
    butter_match: null,
    waffle_match: null,
    syrup_match: null,
  }

  private musicTracks: Record<MusicTrackType, Audio.Sound | null> = {
    menu: null,
    gameplay: null,
    victory: null,
    shop: null,
  }

  private currentMusic: MusicTrackType | null = null
  private soundEnabled = true
  private musicEnabled = true
  private soundVolume = 0.8
  private musicVolume = 0.5
  private initialized = false

  // Initialize sound system
  async init() {
    if (this.initialized) return

    try {
      // Load settings from storage
      await this.loadSettings()

      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      })

      // Preload sound effects
      await this.preloadSoundEffects()

      this.initialized = true
      console.log("Sound system initialized")
    } catch (error) {
      console.error("Failed to initialize sound system:", error)
    }
  }

  // Load user audio settings
  private async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem("audio_settings")
      if (settings) {
        const { soundEnabled, musicEnabled, soundVolume, musicVolume } = JSON.parse(settings)
        this.soundEnabled = soundEnabled
        this.musicEnabled = musicEnabled
        this.soundVolume = soundVolume
        this.musicVolume = musicVolume
      }
    } catch (error) {
      console.error("Failed to load audio settings:", error)
    }
  }

  // Save user audio settings
  async saveSettings() {
    try {
      const settings = {
        soundEnabled: this.soundEnabled,
        musicEnabled: this.musicEnabled,
        soundVolume: this.soundVolume,
        musicVolume: this.musicVolume,
      }
      await AsyncStorage.setItem("audio_settings", JSON.stringify(settings))
    } catch (error) {
      console.error("Failed to save audio settings:", error)
    }
  }

  // Preload all sound effects
  private async preloadSoundEffects() {
    const soundFiles: Record<SoundEffectType, any> = {
      match3: require("../../assets/sounds/match3.mp3"),
      match4: require("../../assets/sounds/match4.mp3"),
      match5: require("../../assets/sounds/match5.mp3"),
      powerup_hammer: require("../../assets/sounds/hammer.mp3"),
      powerup_shuffle: require("../../assets/sounds/shuffle.mp3"),
      powerup_colorbomb: require("../../assets/sounds/colorbomb.mp3"),
      powerup_baconbomb: require("../../assets/sounds/baconbomb.mp3"),
      powerup_maplesyrup: require("../../assets/sounds/maplesyrup.mp3"),
      powerup_coffee: require("../../assets/sounds/coffee.mp3"),
      level_complete: require("../../assets/sounds/victory.mp3"),
      level_failed: require("../../assets/sounds/defeat.mp3"),
      button_click: require("../../assets/sounds/click.mp3"),
      obstacle_break: require("../../assets/sounds/break.mp3"),
      toast_match: require("../../assets/sounds/toast.mp3"),
      pancake_match: require("../../assets/sounds/pancake.mp3"),
      honey_match: require("../../assets/sounds/honey.mp3"),
      butter_match: require("../../assets/sounds/butter.mp3"),
      waffle_match: require("../../assets/sounds/waffle.mp3"),
      syrup_match: require("../../assets/sounds/syrup.mp3"),
    }

    // Load each sound effect
    for (const [key, file] of Object.entries(soundFiles) as [SoundEffectType, any][]) {
      try {
        const { sound } = await Audio.Sound.createAsync(file, { volume: this.soundVolume })
        this.soundEffects[key] = sound
      } catch (error) {
        console.error(`Failed to load sound effect: ${key}`, error)
      }
    }
  }

  // Load a music track
  async loadMusic(track: MusicTrackType) {
    try {
      const musicFiles: Record<MusicTrackType, any> = {
        menu: require("../../assets/music/menu.mp3"),
        gameplay: require("../../assets/music/gameplay.mp3"),
        victory: require("../../assets/music/victory.mp3"),
        shop: require("../../assets/music/shop.mp3"),
      }

      if (!this.musicTracks[track]) {
        const { sound } = await Audio.Sound.createAsync(musicFiles[track], {
          volume: this.musicVolume,
          isLooping: true,
          shouldPlay: false,
        })
        this.musicTracks[track] = sound
      }
    } catch (error) {
      console.error(`Failed to load music track: ${track}`, error)
    }
  }

  // Play a sound effect
  async playSound(sound: SoundEffectType) {
    if (!this.soundEnabled || !this.soundEffects[sound]) return

    try {
      // Stop and rewind the sound first
      await this.soundEffects[sound]?.stopAsync()
      await this.soundEffects[sound]?.setPositionAsync(0)
      await this.soundEffects[sound]?.playAsync()
    } catch (error) {
      console.error(`Failed to play sound: ${sound}`, error)
    }
  }

  // Play a music track
  async playMusic(track: MusicTrackType) {
    if (!this.musicEnabled) return

    try {
      // Stop current music if playing
      if (this.currentMusic && this.musicTracks[this.currentMusic]) {
        await this.musicTracks[this.currentMusic]?.stopAsync()
      }

      // Load the track if not loaded
      if (!this.musicTracks[track]) {
        await this.loadMusic(track)
      }

      // Play the new track
      await this.musicTracks[track]?.setVolumeAsync(this.musicVolume)
      await this.musicTracks[track]?.playAsync()
      this.currentMusic = track
    } catch (error) {
      console.error(`Failed to play music track: ${track}`, error)
    }
  }

  // Stop all audio
  async stopAll() {
    try {
      // Stop all sound effects
      for (const sound of Object.values(this.soundEffects)) {
        if (sound) await sound.stopAsync()
      }

      // Stop current music
      if (this.currentMusic && this.musicTracks[this.currentMusic]) {
        await this.musicTracks[this.currentMusic]?.stopAsync()
      }

      this.currentMusic = null
    } catch (error) {
      console.error("Failed to stop all audio:", error)
    }
  }

  // Toggle sound effects
  toggleSound(enabled?: boolean) {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled
    this.saveSettings()
    return this.soundEnabled
  }

  // Toggle music
  toggleMusic(enabled?: boolean) {
    this.musicEnabled = enabled !== undefined ? enabled : !this.musicEnabled

    if (!this.musicEnabled && this.currentMusic && this.musicTracks[this.currentMusic]) {
      this.musicTracks[this.currentMusic]?.stopAsync()
    } else if (this.musicEnabled && this.currentMusic && this.musicTracks[this.currentMusic]) {
      this.musicTracks[this.currentMusic]?.playAsync()
    }

    this.saveSettings()
    return this.musicEnabled
  }

  // Set sound volume
  setSoundVolume(volume: number) {
    this.soundVolume = Math.max(0, Math.min(1, volume))

    // Update volume for all sound effects
    for (const sound of Object.values(this.soundEffects)) {
      if (sound) sound.setVolumeAsync(this.soundVolume)
    }

    this.saveSettings()
    return this.soundVolume
  }

  // Set music volume
  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume))

    // Update volume for current music
    if (this.currentMusic && this.musicTracks[this.currentMusic]) {
      this.musicTracks[this.currentMusic]?.setVolumeAsync(this.musicVolume)
    }

    this.saveSettings()
    return this.musicVolume
  }

  // Clean up resources
  async unload() {
    try {
      await this.stopAll()

      // Unload all sound effects
      for (const [key, sound] of Object.entries(this.soundEffects)) {
        if (sound) {
          await sound.unloadAsync()
          this.soundEffects[key as SoundEffectType] = null
        }
      }

      // Unload all music tracks
      for (const [key, track] of Object.entries(this.musicTracks)) {
        if (track) {
          await track.unloadAsync()
          this.musicTracks[key as MusicTrackType] = null
        }
      }

      this.initialized = false
    } catch (error) {
      console.error("Failed to unload sound resources:", error)
    }
  }

  // Getters for current settings
  isSoundEnabled() {
    return this.soundEnabled
  }
  isMusicEnabled() {
    return this.musicEnabled
  }
  getSoundVolume() {
    return this.soundVolume
  }
  getMusicVolume() {
    return this.musicVolume
  }
}

// Create singleton instance
export const SoundManager = new SoundManagerClass()

// React hook for using sound manager in components
export function useSoundManager() {
  const [isReady, setIsReady] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(SoundManager.isSoundEnabled())
  const [musicEnabled, setMusicEnabled] = useState(SoundManager.isMusicEnabled())
  const [soundVolume, setSoundVolume] = useState(SoundManager.getSoundVolume())
  const [musicVolume, setMusicVolume] = useState(SoundManager.getMusicVolume())

  useEffect(() => {
    // Initialize sound manager
    const initSound = async () => {
      await SoundManager.init()
      setSoundEnabled(SoundManager.isSoundEnabled())
      setMusicEnabled(SoundManager.isMusicEnabled())
      setSoundVolume(SoundManager.getSoundVolume())
      setMusicVolume(SoundManager.getMusicVolume())
      setIsReady(true)
    }

    initSound()

    // Clean up on unmount
    return () => {
      // No need to unload here as we want to keep the singleton alive
    }
  }, [])

  // Wrapper functions that update state
  const toggleSound = (enabled?: boolean) => {
    const newState = SoundManager.toggleSound(enabled)
    setSoundEnabled(newState)
    return newState
  }

  const toggleMusic = (enabled?: boolean) => {
    const newState = SoundManager.toggleMusic(enabled)
    setMusicEnabled(newState)
    return newState
  }

  const updateSoundVolume = (volume: number) => {
    const newVolume = SoundManager.setSoundVolume(volume)
    setSoundVolume(newVolume)
    return newVolume
  }

  const updateMusicVolume = (volume: number) => {
    const newVolume = SoundManager.setMusicVolume(volume)
    setMusicVolume(newVolume)
    return newVolume
  }

  return {
    isReady,
    soundEnabled,
    musicEnabled,
    soundVolume,
    musicVolume,
    toggleSound,
    toggleMusic,
    setSoundVolume: updateSoundVolume,
    setMusicVolume: updateMusicVolume,
    playSound: SoundManager.playSound.bind(SoundManager),
    playMusic: SoundManager.playMusic.bind(SoundManager),
    stopAll: SoundManager.stopAll.bind(SoundManager),
  }
}
