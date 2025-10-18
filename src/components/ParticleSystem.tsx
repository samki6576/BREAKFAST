"use client"

import { useEffect, useState } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from "react-native-reanimated"

const { width, height } = Dimensions.get("window")

interface Particle {
  id: string
  x: number
  y: number
  emoji: string
  duration: number
}

interface ParticleSystemProps {
  trigger: boolean
  type: "match" | "powerup" | "levelComplete"
  position?: { x: number; y: number }
}

export default function ParticleSystem({ trigger, type, position }: ParticleSystemProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  const createParticles = () => {
    const newParticles: Particle[] = []
    const count = type === "levelComplete" ? 20 : 8
    const emojis = {
      match: ["🍞", "🥞", "🧈", "🍯"],
      powerup: ["✨", "💫", "⭐", "🌟"],
      levelComplete: ["🎉", "🎊", "🏆", "👏", "🥳"],
    }

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x: position?.x || width / 2 + (Math.random() - 0.5) * 200,
        y: position?.y || height / 2 + (Math.random() - 0.5) * 200,
        emoji: emojis[type][Math.floor(Math.random() * emojis[type].length)],
        duration: 1000 + Math.random() * 1000,
      })
    }

    setParticles(newParticles)

    // Clear particles after animation
    setTimeout(() => {
      setParticles([])
    }, 2500)
  }

  useEffect(() => {
    if (trigger) {
      createParticles()
    }
  }, [trigger])

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <ParticleComponent key={particle.id} particle={particle} />
      ))}
    </View>
  )
}

function ParticleComponent({ particle }: { particle: Particle }) {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(1)
  const scale = useSharedValue(0)

  useEffect(() => {
    // Animate particle
    scale.value = withSequence(withTiming(1.5, { duration: 200 }), withTiming(1, { duration: 300 }))

    translateX.value = withTiming((Math.random() - 0.5) * 300, {
      duration: particle.duration,
    })
    translateY.value = withTiming(-200 - Math.random() * 200, {
      duration: particle.duration,
    })
    opacity.value = withTiming(0, { duration: particle.duration })
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }))

  return (
    <Animated.Text
      style={[
        styles.particle,
        {
          left: particle.x,
          top: particle.y,
        },
        animatedStyle,
      ]}
    >
      {particle.emoji}
    </Animated.Text>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  particle: {
    position: "absolute",
    fontSize: 24,
  },
})
