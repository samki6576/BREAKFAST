"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, runOnJS } from "react-native-reanimated"

const { width } = Dimensions.get("window")

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
}

interface AchievementToastProps {
  achievement: Achievement | null
  onHide: () => void
}

export default function AchievementToast({ achievement, onHide }: AchievementToastProps) {
  const translateY = useSharedValue(-200)
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (achievement) {
      // Animate in
      translateY.value = withSpring(50)
      opacity.value = withSpring(1)

      // Auto hide after 3 seconds
      translateY.value = withDelay(3000, withSpring(-200))
      opacity.value = withDelay(
        3000,
        withSpring(0, {}, () => {
          runOnJS(onHide)()
        }),
      )
    }
  }, [achievement])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }))

  if (!achievement) return null

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient colors={["#f59e0b", "#d97706"]} style={styles.toast} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.content}>
          <Text style={styles.icon}>{achievement.icon}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Achievement Unlocked!</Text>
            <Text style={styles.name}>{achievement.name}</Text>
            <Text style={styles.description}>{achievement.description}</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toast: {
    borderRadius: 15,
    padding: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 40,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fef3c7",
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: "#fde68a",
  },
})
