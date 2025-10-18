"use client"

import { useEffect, useState, useRef } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated"

const { width, height } = Dimensions.get("window")

interface BlastParticle {
  id: string
  x: number
  y: number
  emoji: string
  scale: number
  rotation: number
  velocity: { x: number; y: number }
  life: number
  color: string
}

interface AnimationSystemProps {
  blastTrigger: {
    active: boolean
    position: { x: number; y: number }
    type: "match3" | "match4" | "match5" | "powerup" | "levelComplete" | "combo"
    intensity: number
  }
  onAnimationComplete: () => void
}

export default function AnimationSystem({ blastTrigger, onAnimationComplete }: AnimationSystemProps) {
  const [particles, setParticles] = useState<BlastParticle[]>([])
  const animationRef = useRef<NodeJS.Timeout>()

  const createBlastParticles = (position: { x: number; y: number }, type: string, intensity: number) => {
    const particleCount = Math.min(intensity * 8, 50) // Limit for performance
    const newParticles: BlastParticle[] = []

    const emojis = {
      match3: ["🍞", "🥞", "🧈", "🍯", "✨"],
      match4: ["🍞", "🥞", "🧈", "🍯", "⭐", "💫", "🌟"],
      match5: ["🍞", "🥞", "🧈", "🍯", "🎉", "🎊", "💥", "⚡"],
      powerup: ["💥", "⚡", "🌟", "💫", "✨", "🔥"],
      levelComplete: ["🎉", "🎊", "🏆", "👏", "🥳", "🌟", "💫", "✨"],
      combo: ["🔥", "💥", "⚡", "🌟", "💫", "🎯"],
    }

    const colors = {
      match3: ["#fbbf24", "#f59e0b", "#d97706"],
      match4: ["#f59e0b", "#d97706", "#b45309"],
      match5: ["#dc2626", "#b91c1c", "#991b1b"],
      powerup: ["#8b5cf6", "#7c3aed", "#6d28d9"],
      levelComplete: ["#10b981", "#059669", "#047857"],
      combo: ["#ef4444", "#dc2626", "#b91c1c"],
    }

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5
      const speed = 2 + Math.random() * 4
      const distance = 50 + Math.random() * 100

      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x: position.x,
        y: position.y,
        emoji: emojis[type][Math.floor(Math.random() * emojis[type].length)],
        scale: 0.5 + Math.random() * 1,
        rotation: Math.random() * 360,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        },
        life: 1000 + Math.random() * 1000,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
      })
    }

    setParticles(newParticles)

    // Clear particles after animation
    if (animationRef.current) clearTimeout(animationRef.current)
    animationRef.current = setTimeout(() => {
      setParticles([])
      onAnimationComplete()
    }, 2000)
  }

  useEffect(() => {
    if (blastTrigger.active) {
      createBlastParticles(blastTrigger.position, blastTrigger.type, blastTrigger.intensity)
    }
  }, [blastTrigger])

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <BlastParticle key={particle.id} particle={particle} />
      ))}
    </View>
  )
}

function BlastParticle({ particle }: { particle: BlastParticle }) {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const scale = useSharedValue(0)
  const rotation = useSharedValue(0)
  const opacity = useSharedValue(1)

  useEffect(() => {
    // Initial burst animation
    scale.value = withSequence(
      withTiming(particle.scale * 1.5, { duration: 100, easing: Easing.out(Easing.quad) }),
      withTiming(particle.scale, { duration: 200, easing: Easing.inOut(Easing.quad) }),
    )

    // Movement animation
    translateX.value = withTiming(particle.velocity.x * 50, {
      duration: particle.life,
      easing: Easing.out(Easing.quad),
    })

    translateY.value = withSequence(
      withTiming(particle.velocity.y * 30, {
        duration: particle.life * 0.3,
        easing: Easing.out(Easing.quad),
      }),
      withTiming(particle.velocity.y * 50 + 100, {
        duration: particle.life * 0.7,
        easing: Easing.in(Easing.quad),
      }),
    )

    // Rotation animation
    rotation.value = withTiming(particle.rotation + 360, {
      duration: particle.life,
      easing: Easing.linear,
    })

    // Fade out animation
    opacity.value = withDelay(
      particle.life * 0.6,
      withTiming(0, {
        duration: particle.life * 0.4,
        easing: Easing.in(Easing.quad),
      }),
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }))

  return (
    <Animated.Text
      style={[
        styles.particle,
        {
          left: particle.x,
          top: particle.y,
          color: particle.color,
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
    zIndex: 1000,
  },
  particle: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "bold",
  },
})
