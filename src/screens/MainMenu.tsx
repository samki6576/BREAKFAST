"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { useUser } from "../contexts/UserContext"
import LoginModal from "../components/LoginModal"
import SettingsModal from "../components/SettingsModal"
import type { Screen } from "../../App"

const { width, height } = Dimensions.get("window")

interface MainMenuProps {
  onNavigate: (screen: Screen) => void
}

export default function MainMenu({ onNavigate }: MainMenuProps) {
  const [showLogin, setShowLogin] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const { user } = useUser()

  const menuItems = [
    { title: "Play", icon: "▶️", action: () => (user ? onNavigate("game") : setShowLogin(true)) },
    { title: "World Map", icon: "🗺️", action: () => onNavigate("worldmap") },
  
    { title: "Leaderboard", icon: "🏆", action: () => onNavigate("leaderboard") },
    { title: "Shop", icon: "🛒", action: () => onNavigate("shop") },
    { title: "Settings", icon: "⚙️", action: () => setShowSettings(true) },
    {
      title: user ? "Profile" : "Sign In",
      icon: user ? "👤" : "🔑",
      action: () => (user ? onNavigate("profile") : setShowLogin(true)),
    },
  ]

  return (
    <LinearGradient colors={["#fef3c7", "#fde68a"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* User Info */}
        {user && (
          <View style={styles.userInfo}>
            <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.userCard}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.userLevel}>Level {user.level}</Text>
              <View style={styles.userStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>❤️</Text>
                  <Text style={styles.statValue}>{user.lives}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>🪙</Text>
                  <Text style={styles.statValue}>{user.coins}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.title}>Breakfast Blitz</Text>
          <Text style={styles.subtitle}>A buttery match-3 adventure</Text>
        </View>

        {/* Menu Buttons */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={item.title} style={styles.menuButton} onPress={item.action} activeOpacity={0.8}>
              <LinearGradient
                colors={["#fbbf24", "#f59e0b"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <Text style={styles.buttonIcon}>{item.icon}</Text>
                <Text style={styles.buttonText}>{item.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeElements}>
          <Text style={[styles.decorativeEmoji, { top: 50, left: 30 }]}>🍞</Text>
          <Text style={[styles.decorativeEmoji, { top: 100, right: 40 }]}>🥞</Text>
          <Text style={[styles.decorativeEmoji, { bottom: 150, left: 50 }]}>🧈</Text>
          <Text style={[styles.decorativeEmoji, { bottom: 200, right: 30 }]}>🍯</Text>
        </View>

        {/* Modals */}
        <LoginModal visible={showLogin} onClose={() => setShowLogin(false)} />
        <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userInfo: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  userCard: {
    padding: 15,
    borderRadius: 15,
    minWidth: 150,
    alignItems: "center",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
  },
  userLevel: {
    fontSize: 12,
    color: "#b45309",
    marginBottom: 8,
  },
  userStats: {
    flexDirection: "row",
    gap: 15,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#92400e",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: height * 0.1,
    marginBottom: height * 0.08,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#92400e",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#b45309",
    marginTop: 10,
    textAlign: "center",
  },
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 15,
  },
  menuButton: {
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 15,
  },
  buttonIcon: {
    fontSize: 24,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#92400e",
  },
  decorativeElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  decorativeEmoji: {
    position: "absolute",
    fontSize: 40,
    opacity: 0.3,
  },
})
