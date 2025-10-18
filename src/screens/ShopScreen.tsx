"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { useUser } from "../contexts/UserContext"
import { usePurchaseManager } from "../utils/PurchaseManager"
import { SoundManager } from "../utils/SoundManager"
import type { Screen } from "../../App"

const { width } = Dimensions.get("window")

interface ShopScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function ShopScreen({ onNavigate }: ShopScreenProps) {
  const { user, spendCoins, updateUser } = useUser()
  const { gems, spendGems, hasFeature } = usePurchaseManager()
  const [selectedTab, setSelectedTab] = useState<"coins" | "gems">("coins")

  const coinItems = [
    {
      id: "lives-5",
      name: "5 Lives",
      description: "Refill your lives instantly",
      icon: "❤️",
      price: 50,
      type: "lives" as const,
      amount: 5,
    },
    {
      id: "hammer-3",
      name: "3 Hammers",
      description: "Remove any piece from the board",
      icon: "🔨",
      price: 30,
      type: "powerup" as const,
      powerup: "hammer",
      amount: 3,
    },
    {
      id: "shuffle-2",
      name: "2 Shuffles",
      description: "Shuffle the entire board",
      icon: "🔀",
      price: 40,
      type: "powerup" as const,
      powerup: "shuffle",
      amount: 2,
    },
    {
      id: "extra-moves-3",
      name: "3 Extra Moves",
      description: "Add 5 moves to any level",
      icon: "➕",
      price: 35,
      type: "powerup" as const,
      powerup: "extraMoves",
      amount: 3,
    },
  ]

  const gemItems = [
    {
      id: "premium-lives",
      name: "Infinite Lives (24h)",
      description: "Unlimited lives for 24 hours",
      icon: "💖",
      price: 50,
      type: "temporary" as const,
    },
    {
      id: "premium-powerups",
      name: "VIP Power Pack",
      description: "Exclusive VIP power-ups",
      icon: "⭐",
      price: 100,
      type: "powerup" as const,
      exclusive: true,
    },
    {
      id: "level-skip",
      name: "Skip Level",
      description: "Skip any difficult level",
      icon: "⏭️",
      price: 75,
      type: "utility" as const,
    },
    {
      id: "double-coins",
      name: "2x Coins (1h)",
      description: "Double coin rewards for 1 hour",
      icon: "🪙",
      price: 30,
      type: "temporary" as const,
    },
  ]

  const handleCoinPurchase = (item: any) => {
    if (!user) return

    SoundManager.playSound("button_click")

    if (!spendCoins(item.price)) {
      alert("Not enough coins!")
      return
    }

    switch (item.type) {
      case "lives":
        updateUser({ lives: Math.min(5, user.lives + item.amount) })
        break
      case "powerup":
        // This would update game context power-ups in a real implementation
        alert(`Purchased ${item.amount} ${item.name}!`)
        break
    }

    SoundManager.playSound("level_complete")
  }

  const handleGemPurchase = (item: any) => {
    SoundManager.playSound("button_click")

    if (!spendGems(item.price)) {
      alert("Not enough gems!")
      return
    }

    // Handle gem purchases
    switch (item.type) {
      case "temporary":
        alert(`Activated ${item.name}!`)
        break
      case "powerup":
        alert(`Purchased ${item.name}!`)
        break
      case "utility":
        alert(`${item.name} ready to use!`)
        break
    }

    SoundManager.playSound("level_complete")
  }

  if (!user) {
    onNavigate("menu")
    return null
  }

  return (
    <LinearGradient colors={["#fef3c7", "#fde68a"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => onNavigate("menu")}>
              <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.buttonGradient}>
                <Text style={styles.backButtonText}>← Back</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Shop</Text>

            <View style={styles.currencyDisplay}>
              <View style={styles.currencyItem}>
                <Text style={styles.currencyIcon}>🪙</Text>
                <Text style={styles.currencyCount}>{user.coins}</Text>
              </View>
              <View style={styles.currencyItem}>
                <Text style={styles.currencyIcon}>💎</Text>
                <Text style={styles.currencyCount}>{gems}</Text>
              </View>
            </View>
          </View>

          {/* Premium Shop Banner */}
          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => onNavigate("premium" as Screen)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#8b5cf6", "#7c3aed", "#6d28d9"]}
              style={styles.premiumGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.premiumContent}>
                <Text style={styles.premiumIcon}>👑</Text>
                <View style={styles.premiumText}>
                  <Text style={styles.premiumTitle}>Premium Shop</Text>
                  <Text style={styles.premiumSubtitle}>Exclusive items & VIP benefits</Text>
                </View>
                <Text style={styles.premiumArrow}>→</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Currency Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "coins" && styles.activeTab]}
              onPress={() => {
                setSelectedTab("coins")
                SoundManager.playSound("button_click")
              }}
            >
              <Text style={[styles.tabText, selectedTab === "coins" && styles.activeTabText]}>🪙 Coin Shop</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "gems" && styles.activeTab]}
              onPress={() => {
                setSelectedTab("gems")
                SoundManager.playSound("button_click")
              }}
            >
              <Text style={[styles.tabText, selectedTab === "gems" && styles.activeTabText]}>💎 Gem Shop</Text>
            </TouchableOpacity>
          </View>

          {/* Shop Items */}
          <View style={styles.itemsContainer}>
            {selectedTab === "coins" ? (
              <>
                <Text style={styles.sectionTitle}>Coin Shop</Text>
                <Text style={styles.sectionSubtitle}>Use coins earned from playing to buy helpful items</Text>
                {coinItems.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.shopItem}
                    onPress={() => handleCoinPurchase(item)}
                    disabled={user.coins < item.price}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={user.coins >= item.price ? ["#fde68a", "#fbbf24"] : ["#f3f4f6", "#e5e7eb"]}
                      style={styles.itemGradient}
                    >
                      <View style={styles.itemContent}>
                        <Text style={styles.itemIcon}>{item.icon}</Text>
                        <View style={styles.itemInfo}>
                          <Text style={[styles.itemName, user.coins < item.price && styles.disabledText]}>
                            {item.name}
                          </Text>
                          <Text style={[styles.itemDescription, user.coins < item.price && styles.disabledText]}>
                            {item.description}
                          </Text>
                        </View>
                        <View style={styles.itemPrice}>
                          <View style={styles.priceContainer}>
                            <Text style={styles.priceIcon}>🪙</Text>
                            <Text style={[styles.priceText, user.coins < item.price && styles.disabledText]}>
                              {item.price}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={[styles.buyButton, user.coins < item.price && styles.disabledButton]}
                            disabled={user.coins < item.price}
                          >
                            <Text style={styles.buyButtonText}>BUY</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Gem Shop</Text>
                <Text style={styles.sectionSubtitle}>Premium items available with gems</Text>
                {gemItems.map((item, index) => {
                  const isLocked = item.exclusive && !hasFeature("exclusivePowerUps")
                  const canAfford = gems >= item.price && !isLocked

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.shopItem}
                      onPress={() => canAfford && handleGemPurchase(item)}
                      disabled={!canAfford}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={
                          isLocked
                            ? ["#6b7280", "#4b5563"]
                            : canAfford
                              ? ["#8b5cf6", "#7c3aed"]
                              : ["#f3f4f6", "#e5e7eb"]
                        }
                        style={styles.itemGradient}
                      >
                        <View style={styles.itemContent}>
                          <Text style={styles.itemIcon}>{isLocked ? "🔒" : item.icon}</Text>
                          <View style={styles.itemInfo}>
                            <Text
                              style={[
                                styles.itemName,
                                !canAfford && styles.disabledText,
                                isLocked && styles.lockedText,
                              ]}
                            >
                              {isLocked ? "VIP Exclusive" : item.name}
                            </Text>
                            <Text
                              style={[
                                styles.itemDescription,
                                !canAfford && styles.disabledText,
                                isLocked && styles.lockedText,
                              ]}
                            >
                              {isLocked ? "Unlock with VIP membership" : item.description}
                            </Text>
                          </View>
                          <View style={styles.itemPrice}>
                            {!isLocked && (
                              <View style={styles.priceContainer}>
                                <Text style={styles.priceIcon}>💎</Text>
                                <Text style={[styles.priceText, !canAfford && styles.disabledText]}>{item.price}</Text>
                              </View>
                            )}
                            <TouchableOpacity
                              style={[styles.buyButton, !canAfford && styles.disabledButton]}
                              disabled={!canAfford}
                            >
                              <Text style={styles.buyButtonText}>{isLocked ? "LOCKED" : "BUY"}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  )
                })}
              </>
            )}
          </View>

          {/* Get More Currency */}
          <View style={styles.getCurrencySection}>
            <Text style={styles.getCurrencyTitle}>Need More {selectedTab === "coins" ? "Coins" : "Gems"}?</Text>
            {selectedTab === "coins" ? (
              <View style={styles.getCurrencyOptions}>
                <Text style={styles.getCurrencyOption}>• Complete levels to earn coins</Text>
                <Text style={styles.getCurrencyOption}>• Watch ads for free coins</Text>
                <Text style={styles.getCurrencyOption}>• Daily login bonuses</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.getGemsButton}
                onPress={() => onNavigate("premium" as Screen)}
                activeOpacity={0.8}
              >
                <LinearGradient colors={["#8b5cf6", "#7c3aed"]} style={styles.getGemsGradient}>
                  <Text style={styles.getGemsText}>Buy Gems in Premium Shop</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
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
  currencyDisplay: {
    flexDirection: "row",
    gap: 10,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  currencyIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  currencyCount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#92400e",
  },
  premiumBanner: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  premiumGradient: {
    padding: 20,
  },
  premiumContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  premiumIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  premiumArrow: {
    fontSize: 24,
    color: "white",
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#b45309",
  },
  activeTabText: {
    color: "#92400e",
  },
  itemsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#b45309",
    marginBottom: 15,
  },
  shopItem: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemGradient: {
    padding: 20,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: "#b45309",
  },
  disabledText: {
    color: "#9ca3af",
  },
  lockedText: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  itemPrice: {
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  priceIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
  },
  buyButton: {
    backgroundColor: "#92400e",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  buyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  getCurrencySection: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  getCurrencyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 15,
    textAlign: "center",
  },
  getCurrencyOptions: {
    gap: 8,
  },
  getCurrencyOption: {
    fontSize: 14,
    color: "#b45309",
  },
  getGemsButton: {
    borderRadius: 15,
    overflow: "hidden",
  },
  getGemsGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  getGemsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
