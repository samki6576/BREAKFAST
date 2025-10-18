"use client"

import { useEffect, useState, useRef } from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
  Easing,
} from "react-native-reanimated"

const { width, height } = Dimensions.get("window")

interface ComboSystemProps {
  combo: number
  onComboEnd: () => void
}

export default function ComboSystem({ combo, onComboEnd }: ComboSystemProps) {
  const [showCombo, setShowCombo] = useState(false)
  const [comboText, setComboText] = useState("")
  const comboTimeout = useRef<number | null>(null)

  const scale = useSharedValue(0)
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(50)
  const rotation = useSharedValue(-10)

  const getComboText = (comboCount: number) => {
    if (comboCount >= 10) return "INCREDIBLE! 🔥"
    if (comboCount >= 8) return "AMAZING! ⚡"
    if (comboCount >= 6) return "FANTASTIC! 🌟"
    if (comboCount >= 4) return "GREAT! 💫"
    if (comboCount >= 3) return "NICE! ✨"
    return `${comboCount}x COMBO!`
  }

  const getComboColors = (comboCount: number) => {
    if (comboCount >= 10) return ["#dc2626", "#b91c1c", "#991b1b"] // Red
    if (comboCount >= 8) return ["#7c3aed", "#6d28d9", "#5b21b6"] // Purple
    if (comboCount >= 6) return ["#059669", "#047857", "#065f46"] // Green
    if (comboCount >= 4) return ["#d97706", "#b45309", "#92400e"] // Orange
    return ["#fbbf24", "#f59e0b", "#d97706"] // Yellow
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }, { rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }))

  useEffect(() => {
    if (combo >= 3) {
      setComboText(getComboText(combo))
      setShowCombo(true)

      // Entrance animation
      scale.value = withSequence(
        withTiming(1.5, { duration: 200, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 150, easing: Easing.inOut(Easing.quad) }),
      )

      opacity.value = withTiming(1, { duration: 200 })
      translateY.value = withSpring(0, { damping: 8, stiffness: 100 })
      rotation.value = withSpring(0, { damping: 10, stiffness: 150 })

      // Exit animation
      const exitDelay = Math.min(combo * 200, 2000) // Longer display for higher combos

      if (comboTimeout.current) {
        clearTimeout(comboTimeout.current)
      }

      comboTimeout.current = setTimeout(() => {
        scale.value = withTiming(0.8, { duration: 300 })
        opacity.value = withTiming(0, { duration: 300 })
        translateY.value = withTiming(-30, { duration: 300 })

        comboTimeout.current = setTimeout(() => {
          setShowCombo(false)
          runOnJS(onComboEnd)()
        }, 300)
      }, exitDelay)
    }

    return () => {
      if (comboTimeout.current) {
        clearTimeout(comboTimeout.current)
      }
    }
  }, [combo])

  if (!showCombo) return null

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.comboContainer, animatedStyle]}>
        <LinearGradient
          colors={getComboColors(combo)}
          style={styles.comboGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.comboText}>{comboText}</Text>
          <Text style={styles.comboNumber}>{combo}x</Text>
        </LinearGradient>
      </Animated.View>

      {/* Sparkle effects around the combo */}
      {[...Array(8)].map((_, i) => (
        <SparkleEffect key={i} index={i} combo={combo} />
      ))}
    </View>
  )
}

function SparkleEffect({ index, combo }: { index: number; combo: number }) {
  const scale = useSharedValue(0)
  const opacity = useSharedValue(0)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const rotation = useSharedValue(0)

  useEffect(() => {
    const delay = index * 50
    const angle = (Math.PI * 2 * index) / 8
    const distance = 80 + combo * 5

    setTimeout(() => {
      scale.value = withSequence(withTiming(1, { duration: 200 }), withDelay(500, withTiming(0, { duration: 300 })))

      opacity.value = withSequence(withTiming(1, { duration: 200 }), withDelay(500, withTiming(0, { duration: 300 })))

      translateX.value = withTiming(Math.cos(angle) * distance, { duration: 800 })
      translateY.value = withTiming(Math.sin(angle) * distance, { duration: 800 })
      rotation.value = withTiming(360, { duration: 800 })
    }, delay)
  }, [combo])

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }))

  return <Animated.Text style={[styles.sparkle, sparkleStyle]}>✨</Animated.Text>
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  comboContainer: {
    borderRadius: 25,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  comboGradient: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignItems: "center",
  },
  comboText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  comboNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sparkle: {
    position: "absolute",
    fontSize: 16,
  },
})
