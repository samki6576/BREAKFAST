"use client"

import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  RefreshControl,
  Dimensions,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { useUser } from "../contexts/UserContext"
import { useLeaderboard, type LeaderboardEntry, type Tournament } from "../contexts/LeaderboardContext"
import { SoundManager } from "../utils/SoundManager"
import type { Screen } from "../../App"

const { width } = Dimensions.get("window")

interface LeaderboardScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function LeaderboardScreen({ onNavigate }: LeaderboardScreenProps) {
  const { user } = useUser()
  const {
    globalLeaderboard,
    weeklyLeaderboard,
    friendsLeaderboard,
    tournaments,
    currentUserRank,
    isLoading,
    refreshLeaderboard,
    addFriend,
    joinTournament,
    searchPlayer,
  } = useLeaderboard()

  const [selectedTab, setSelectedTab] = useState<"global" | "weekly" | "friends" | "tournaments">("global")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<LeaderboardEntry[]>([])
  const [showSearch, setShowSearch] = useState(false)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length >= 2) {
      const results = await searchPlayer(query)
      setSearchResults(results)
      setShowSearch(true)
    } else {
      setShowSearch(false)
      setSearchResults([])
    }
  }

  const handleAddFriend = async (friendId: string) => {
    try {
      await addFriend(friendId)
      Alert.alert("Success! 🎉", "Friend request sent!", [{ text: "OK" }])
      SoundManager.playSound("level_complete")
    } catch (error) {
      Alert.alert("Error", "Failed to send friend request", [{ text: "OK" }])
    }
  }

  const handleJoinTournament = async (tournament: Tournament) => {
    if (tournament.isActive) {
      Alert.alert("Already Active", "This tournament is already in progress!", [{ text: "OK" }])
      return
    }

    Alert.alert("Join Tournament? 🏆", `Join "${tournament.name}"?\n\nPrize: ${tournament.prize}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Join!",
        onPress: async () => {
          await joinTournament(tournament.id)
          SoundManager.playSound("level_complete")
          Alert.alert("Joined! 🎉", "You're now registered for the tournament!", [{ text: "Awesome!" }])
        },
      },
    ])
  }

  const getCurrentLeaderboard = () => {
    switch (selectedTab) {
      case "global":
        return globalLeaderboard
      case "weekly":
        return weeklyLeaderboard
      case "friends":
        return friendsLeaderboard
      default:
        return []
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return "Just now"
  }

  const formatTimeLeft = (endTime: number) => {
    const now = Date.now()
    const diff = endTime - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const renderLeaderboardEntry = (entry: LeaderboardEntry, index: number) => {
    const isCurrentUser = entry.username === user?.username
    const getRankIcon = (rank: number) => {
      if (rank === 1) return "🥇"
      if (rank === 2) return "🥈"
      if (rank === 3) return "🥉"
      return `#${rank}`
    }

    return (
      <TouchableOpacity
        key={entry.id}
        style={[styles.leaderboardEntry, isCurrentUser && styles.currentUserEntry]}
        onPress={() => {
          SoundManager.playSound("button_click")
          // Could open player profile here
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            isCurrentUser ? ["#fbbf24", "#f59e0b"] : entry.rank <= 3 ? ["#fde68a", "#fbbf24"] : ["#f9fafb", "#f3f4f6"]
          }
          style={styles.entryGradient}
        >
          <View style={styles.entryContent}>
            <View style={styles.rankSection}>
              <Text style={[styles.rankText, isCurrentUser && styles.currentUserText]}>{getRankIcon(entry.rank)}</Text>
            </View>

            <View style={styles.playerInfo}>
              <View style={styles.playerHeader}>
                <Text style={styles.playerAvatar}>{entry.avatar}</Text>
                <View style={styles.playerDetails}>
                  <Text style={[styles.playerName, isCurrentUser && styles.currentUserText]}>
                    {entry.username}
                    {isCurrentUser && " (You)"}
                  </Text>
                  <View style={styles.playerMeta}>
                    <Text style={styles.countryFlag}>{entry.country}</Text>
                    <Text style={styles.playerLevel}>Level {entry.level}</Text>
                    <Text style={styles.lastActive}>{formatTime(entry.lastActive)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.achievements}>
                {entry.achievements.slice(0, 3).map((achievement, i) => (
                  <Text key={i} style={styles.achievementBadge}>
                    {achievement}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.scoreSection}>
              <Text style={[styles.scoreText, isCurrentUser && styles.currentUserText]}>
                {entry.score.toLocaleString()}
              </Text>
              <Text style={styles.scoreLabel}>points</Text>
              {!isCurrentUser && selectedTab === "global" && (
                <TouchableOpacity
                  style={styles.addFriendButton}
                  onPress={() => handleAddFriend(entry.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addFriendText}>+ Friend</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  const renderTournament = (tournament: Tournament) => {
    const isActive = tournament.isActive
    const timeLeft = formatTimeLeft(tournament.endTime)

    return (
      <TouchableOpacity
        key={tournament.id}
        style={styles.tournamentCard}
        onPress={() => handleJoinTournament(tournament)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isActive ? ["#dc2626", "#b91c1c"] : ["#8b5cf6", "#7c3aed"]}
          style={styles.tournamentGradient}
        >
          <View style={styles.tournamentHeader}>
            <Text style={styles.tournamentIcon}>🏆</Text>
            <View style={styles.tournamentInfo}>
              <Text style={styles.tournamentName}>{tournament.name}</Text>
              <Text style={styles.tournamentDescription}>{tournament.description}</Text>
            </View>
            <View style={styles.tournamentStatus}>
              <Text style={styles.statusText}>{isActive ? "LIVE" : "UPCOMING"}</Text>
              <Text style={styles.timeLeftText}>{isActive ? timeLeft : "Starts soon"}</Text>
            </View>
          </View>

          <View style={styles.tournamentDetails}>
            <View style={styles.tournamentStat}>
              <Text style={styles.statLabel}>Prize</Text>
              <Text style={styles.statValue}>{tournament.prize}</Text>
            </View>
            <View style={styles.tournamentStat}>
              <Text style={styles.statLabel}>Players</Text>
              <Text style={styles.statValue}>{tournament.participants.toLocaleString()}</Text>
            </View>
            {tournament.userRank && (
              <View style={styles.tournamentStat}>
                <Text style={styles.statLabel}>Your Rank</Text>
                <Text style={styles.statValue}>#{tournament.userRank}</Text>
              </View>
            )}
          </View>

          {!isActive && (
            <View style={styles.joinButton}>
              <Text style={styles.joinButtonText}>JOIN TOURNAMENT</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <LinearGradient colors={["#fef3c7", "#fde68a"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => onNavigate("menu")}>
            <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.buttonGradient}>
              <Text style={styles.backButtonText}>← Back</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Leaderboards</Text>

          <View style={styles.userRank}>
            <Text style={styles.rankLabel}>Your Rank</Text>
            <Text style={styles.rankNumber}>#{currentUserRank}</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search players..."
            placeholderTextColor="#b45309"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        {showSearch && (
          <View style={styles.searchResults}>
            <ScrollView style={styles.searchList} nestedScrollEnabled>
              {searchResults.map((entry, index) => renderLeaderboardEntry(entry, index))}
            </ScrollView>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {[
            { key: "global", label: "🌍 Global", count: globalLeaderboard.length },
            { key: "weekly", label: "📅 Weekly", count: weeklyLeaderboard.length },
            { key: "friends", label: "👥 Friends", count: friendsLeaderboard.length },
            { key: "tournaments", label: "🏆 Events", count: tournaments.length },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
              onPress={() => {
                setSelectedTab(tab.key as any)
                setShowSearch(false)
                SoundManager.playSound("button_click")
              }}
            >
              <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
              <Text style={[styles.tabCount, selectedTab === tab.key && styles.activeTabCount]}>{tab.count}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshLeaderboard} />}
          showsVerticalScrollIndicator={false}
        >
          {selectedTab === "tournaments" ? (
            <View style={styles.tournamentsContainer}>{tournaments.map(renderTournament)}</View>
          ) : (
            <View style={styles.leaderboardContainer}>
              {getCurrentLeaderboard().map((entry, index) => renderLeaderboardEntry(entry, index))}
            </View>
          )}
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
  backButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#92400e",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#92400e",
  },
  userRank: {
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  rankLabel: {
    fontSize: 10,
    color: "#b45309",
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#92400e",
    borderWidth: 2,
    borderColor: "#fbbf24",
  },
  searchButton: {
    backgroundColor: "#fbbf24",
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    fontSize: 18,
  },
  searchResults: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    marginBottom: 15,
    maxHeight: 200,
    borderWidth: 2,
    borderColor: "#fbbf24",
  },
  searchList: {
    padding: 10,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#fbbf24",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#b45309",
  },
  activeTabText: {
    color: "#92400e",
  },
  tabCount: {
    fontSize: 10,
    color: "#b45309",
    marginTop: 2,
  },
  activeTabCount: {
    color: "#92400e",
  },
  content: {
    flex: 1,
  },
  leaderboardContainer: {
    gap: 10,
    paddingBottom: 20,
  },
  leaderboardEntry: {
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  currentUserEntry: {
    borderWidth: 3,
    borderColor: "#f59e0b",
  },
  entryGradient: {
    padding: 15,
  },
  entryContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankSection: {
    width: 50,
    alignItems: "center",
  },
  rankText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
  },
  currentUserText: {
    color: "#92400e",
  },
  playerInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  playerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  playerAvatar: {
    fontSize: 24,
    marginRight: 10,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 4,
  },
  playerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countryFlag: {
    fontSize: 14,
  },
  playerLevel: {
    fontSize: 12,
    color: "#b45309",
  },
  lastActive: {
    fontSize: 10,
    color: "#9ca3af",
  },
  achievements: {
    flexDirection: "row",
    gap: 4,
  },
  achievementBadge: {
    fontSize: 12,
  },
  scoreSection: {
    alignItems: "flex-end",
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
  },
  scoreLabel: {
    fontSize: 10,
    color: "#b45309",
  },
  addFriendButton: {
    backgroundColor: "#10b981",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  addFriendText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  tournamentsContainer: {
    gap: 15,
    paddingBottom: 20,
  },
  tournamentCard: {
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tournamentGradient: {
    padding: 20,
  },
  tournamentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  tournamentIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  tournamentDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  tournamentStatus: {
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  timeLeftText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  tournamentDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  tournamentStat: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  joinButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
