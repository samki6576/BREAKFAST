"use client"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { useUser } from "../contexts/UserContext"
import type { Screen } from "../../App"

const { width } = Dimensions.get("window")

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { user, signOut } = useUser()

  if (!user) {
    onNavigate("menu")
    return null
  }

  const achievements = [
    { id: "first-level", name: "First Steps", description: "Complete your first level", icon: "🎯" },
    { id: "score-master", name: "Score Master", description: "Score over 5000 points in a single level", icon: "🏆" },
    { id: "combo-king", name: "Combo King", description: "Create a 5+ combo chain", icon: "⚡" },
    { id: "perfect-level", name: "Perfect Level", description: "Complete a level with 3 stars", icon: "⭐" },
  ]

  return (
    <LinearGradient colors={["#fef3c7", "#fde68a"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={() => onNavigate("menu")}>
              <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.buttonGradient}>
                <Text style={styles.headerButtonText}>← Back</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Player Profile</Text>

            <TouchableOpacity style={styles.headerButton} onPress={signOut}>
              <LinearGradient colors={["#dc2626", "#b91c1c"]} style={styles.buttonGradient}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <LinearGradient colors={["#fde68a", "#fbbf24"]} style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarIcon}>👤</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <Text style={styles.level}>Level {user.level}</Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🏆</Text>
                <Text style={styles.statValue}>{user.totalScore.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Score</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🪙</Text>
                <Text style={styles.statValue}>{user.coins}</Text>
                <Text style={styles.statLabel}>Coins</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statIcon}>❤️</Text>
                <Text style={styles.statValue}>{user.lives}</Text>
                <Text style={styles.statLabel}>Lives</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statValue}>{user.completedLevels.length}</Text>
                <Text style={styles.statLabel}>Levels</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Achievements */}
          <LinearGradient colors={["#fde68a", "#fbbf24"]} style={styles.achievementsCard}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsList}>
              {achievements.map((achievement) => {
                const isUnlocked = user.achievements.includes(achievement.id)
                return (
                  <View
                    key={achievement.id}
                    style={[styles.achievementItem, isUnlocked ? styles.unlockedAchievement : styles.lockedAchievement]}
                  >
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <View style={styles.achievementInfo}>
                      <Text style={[styles.achievementName, !isUnlocked && styles.lockedText]}>{achievement.name}</Text>
                      <Text style={[styles.achievementDesc, !isUnlocked && styles.lockedText]}>
                        {achievement.description}
                      </Text>
                    </View>
                    {isUnlocked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                )
              })}
            </View>
          </LinearGradient>

          {/* Daily Rewards */}
          <LinearGradient colors={["#fde68a", "#fbbf24"]} style={styles.dailyRewardsCard}>
            <Text style={styles.sectionTitle}>Daily Rewards</Text>
            <View style={styles.dailyRewardsContent}>
              <View style={styles.streakInfo}>
                <Text style={styles.streakText}>
                  Current Streak: <Text style={styles.streakNumber}>{user.dailyRewardStreak} days</Text>
                </Text>
                <Text style={styles.streakSubtext}>Come back daily to maintain your streak!</Text>
              </View>
              <TouchableOpacity style={styles.claimButton} activeOpacity={0.8}>
                <LinearGradient colors={["#f59e0b", "#d97706"]} style={styles.buttonGradient}>
                  <Text style={styles.claimText}>Claim Daily Reward</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ScrollView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  headerButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#92400e",
  },
  signOutText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#92400e",
  },
  profileCard: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#f59e0b",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f59e0b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  avatarIcon: {
    fontSize: 40,
    color: "#92400e",
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#92400e",
  },
  email: {
    fontSize: 16,
    color: "#b45309",
    marginVertical: 2,
  },
  level: {
    fontSize: 16,
    color: "#b45309",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  statCard: {
    backgroundColor: "#fef3c7",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    width: (width - 80) / 2,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#92400e",
  },
  statLabel: {
    fontSize: 12,
    color: "#b45309",
  },
  achievementsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#f59e0b",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 20,
  },
  achievementsList: {
    gap: 15,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
  },
  unlockedAchievement: {
    backgroundColor: "#fef3c7",
    borderColor: "#fbbf24",
  },
  lockedAchievement: {
    backgroundColor: "#f3f4f6",
    borderColor: "#d1d5db",
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
  },
  achievementDesc: {
    fontSize: 12,
    color: "#b45309",
  },
  lockedText: {
    color: "#6b7280",
  },
  checkmark: {
    fontSize: 24,
    color: "#10b981",
  },
  dailyRewardsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#f59e0b",
  },
  dailyRewardsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakInfo: {
    flex: 1,
  },
  streakText: {
    fontSize: 16,
    color: "#92400e",
  },
  streakNumber: {
    fontWeight: "bold",
  },
  streakSubtext: {
    fontSize: 12,
    color: "#b45309",
    marginTop: 5,
  },
  claimButton: {
    borderRadius: 15,
    overflow: "hidden",
  },
  claimText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
})
