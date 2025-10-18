"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { usePurchaseManager, type PurchaseProduct } from "../utils/PurchaseManager"
import { SoundManager } from "../utils/SoundManager"
import type { Screen } from "../../App"

const { width } = Dimensions.get("window")

interface PremiumShopScreenProps {
  onNavigate: (screen: Screen) => void
}

export default function PremiumShopScreen({ onNavigate }: PremiumShopScreenProps) {
  const { isReady, products, gems, premiumFeatures, purchaseProduct, hasFeature } = usePurchaseManager()
  const [purchasing, setPurchasing] = useState<string | null>(null)

  const handlePurchase = async (product: PurchaseProduct) => {
    try {
      setPurchasing(product.productId)
      SoundManager.playSound("button_click")

      await purchaseProduct(product.productId)

      Alert.alert("Purchase Successful! 🎉", `You've successfully purchased ${product.title}!`, [
        { text: "Awesome!", onPress: () => SoundManager.playSound("level_complete") },
      ])
    } catch (error) {
      Alert.alert("Purchase Failed", "Something went wrong with your purchase. Please try again.", [{ text: "OK" }])
    } finally {
      setPurchasing(null)
    }
  }

  const renderGemPackages = () => {
    const gemProducts = products.filter((p) => p.gems && p.type === "consumable")

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💎 Premium Gems</Text>
        <Text style={styles.sectionSubtitle}>Use gems to buy exclusive items and skip waiting times</Text>

        <View style={styles.productGrid}>
          {gemProducts.map((product) => (
            <TouchableOpacity
              key={product.productId}
              style={styles.gemPackage}
              onPress={() => handlePurchase(product)}
              disabled={purchasing === product.productId}
              activeOpacity={0.8}
            >
              <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.packageGradient}>
                <View style={styles.packageHeader}>
                  <Text style={styles.gemIcon}>💎</Text>
                  <Text style={styles.gemAmount}>{product.gems}</Text>
                </View>
                <Text style={styles.packageTitle}>{product.title}</Text>
                <Text style={styles.packagePrice}>{product.price}</Text>
                {product.gems && product.gems >= 500 && (
                  <View style={styles.bonusBadge}>
                    <Text style={styles.bonusText}>BONUS!</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  const renderPowerUpBundles = () => {
    const powerUpProducts = products.filter((p) => p.powerUps && p.type === "consumable")

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Power-up Bundles</Text>
        <Text style={styles.sectionSubtitle}>Get the edge you need to conquer difficult levels</Text>

        {powerUpProducts.map((product) => (
          <TouchableOpacity
            key={product.productId}
            style={styles.bundleCard}
            onPress={() => handlePurchase(product)}
            disabled={purchasing === product.productId}
            activeOpacity={0.8}
          >
            <LinearGradient colors={["#fde68a", "#fbbf24"]} style={styles.bundleGradient}>
              <View style={styles.bundleContent}>
                <View style={styles.bundleInfo}>
                  <Text style={styles.bundleTitle}>{product.title}</Text>
                  <Text style={styles.bundleDescription}>{product.description}</Text>

                  {product.powerUps && (
                    <View style={styles.powerUpList}>
                      {Object.entries(product.powerUps).map(([powerUp, count]) => (
                        <View key={powerUp} style={styles.powerUpItem}>
                          <Text style={styles.powerUpIcon}>
                            {powerUp === "hammer" && "🔨"}
                            {powerUp === "shuffle" && "🔀"}
                            {powerUp === "extraMoves" && "➕"}
                            {powerUp === "baconBomb" && "🥓"}
                            {powerUp === "mapleSyrup" && "🍁"}
                            {powerUp === "colorBomb" && "💣"}
                            {powerUp === "coffeeBoost" && "☕"}
                          </Text>
                          <Text style={styles.powerUpCount}>×{count}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.bundlePrice}>
                  <Text style={styles.priceText}>{product.price}</Text>
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => handlePurchase(product)}
                    disabled={purchasing === product.productId}
                  >
                    <Text style={styles.buyButtonText}>{purchasing === product.productId ? "..." : "BUY"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  const renderPremiumFeatures = () => {
    const featureProducts = products.filter((p) => p.features && p.type === "non_consumable")

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌟 Premium Features</Text>
        <Text style={styles.sectionSubtitle}>Unlock exclusive features for the ultimate experience</Text>

        {featureProducts.map((product) => {
          const isOwned = product.features?.some((feature) => hasFeature(feature as any))

          return (
            <TouchableOpacity
              key={product.productId}
              style={[styles.featureCard, isOwned && styles.ownedFeature]}
              onPress={() => !isOwned && handlePurchase(product)}
              disabled={isOwned || purchasing === product.productId}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isOwned ? ["#10b981", "#059669"] : ["#8b5cf6", "#7c3aed"]}
                style={styles.featureGradient}
              >
                <View style={styles.featureContent}>
                  <View style={styles.featureInfo}>
                    <Text style={styles.featureIcon}>
                      {product.productId.includes("ads") && "🚫"}
                      {product.productId.includes("themes") && "🎨"}
                      {product.productId.includes("lives") && "❤️"}
                      {product.productId.includes("powerups") && "⭐"}
                    </Text>
                    <View style={styles.featureText}>
                      <Text style={styles.featureTitle}>{product.title}</Text>
                      <Text style={styles.featureDescription}>{product.description}</Text>
                    </View>
                  </View>

                  <View style={styles.featureAction}>
                    {isOwned ? (
                      <View style={styles.ownedBadge}>
                        <Text style={styles.ownedText}>OWNED ✓</Text>
                      </View>
                    ) : (
                      <View style={styles.featurePricing}>
                        <Text style={styles.featurePrice}>{product.price}</Text>
                        <TouchableOpacity style={styles.featureBuyButton}>
                          <Text style={styles.featureBuyText}>
                            {purchasing === product.productId ? "..." : "UNLOCK"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const renderVIPMembership = () => {
    const vipProduct = products.find((p) => p.productId.includes("vip"))
    if (!vipProduct) return null

    const isVIP = hasFeature("vipMembership")

    return (
      <View style={styles.section}>
        <LinearGradient colors={["#fbbf24", "#f59e0b", "#d97706"]} style={styles.vipCard}>
          <View style={styles.vipHeader}>
            <Text style={styles.vipIcon}>👑</Text>
            <Text style={styles.vipTitle}>VIP MEMBERSHIP</Text>
            <Text style={styles.vipIcon}>👑</Text>
          </View>

          <Text style={styles.vipSubtitle}>Get ALL premium features + exclusive benefits!</Text>

          <View style={styles.vipBenefits}>
            <Text style={styles.vipBenefit}>✓ Remove all ads forever</Text>
            <Text style={styles.vipBenefit}>✓ Unlimited lives</Text>
            <Text style={styles.vipBenefit}>✓ Exclusive VIP power-ups</Text>
            <Text style={styles.vipBenefit}>✓ Premium themes collection</Text>
            <Text style={styles.vipBenefit}>✓ 2x daily bonus rewards</Text>
            <Text style={styles.vipBenefit}>✓ Priority customer support</Text>
          </View>

          {isVIP ? (
            <View style={styles.vipOwnedBadge}>
              <Text style={styles.vipOwnedText}>ACTIVE VIP MEMBER ✓</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.vipBuyButton}
              onPress={() => handlePurchase(vipProduct)}
              disabled={purchasing === vipProduct.productId}
              activeOpacity={0.8}
            >
              <LinearGradient colors={["#dc2626", "#b91c1c"]} style={styles.vipBuyGradient}>
                <Text style={styles.vipBuyText}>
                  {purchasing === vipProduct.productId ? "Processing..." : `START VIP - ${vipProduct.price}`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
    )
  }

  if (!isReady) {
    return (
      <LinearGradient colors={["#fef3c7", "#fde68a"]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.loadingText}>Loading Premium Shop...</Text>
        </SafeAreaView>
      </LinearGradient>
    )
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

            <Text style={styles.headerTitle}>Premium Shop</Text>

            <View style={styles.gemsDisplay}>
              <Text style={styles.gemsIcon}>💎</Text>
              <Text style={styles.gemsCount}>{gems}</Text>
            </View>
          </View>

          {/* VIP Membership */}
          {renderVIPMembership()}

          {/* Gem Packages */}
          {renderGemPackages()}

          {/* Power-up Bundles */}
          {renderPowerUpBundles()}

          {/* Premium Features */}
          {renderPremiumFeatures()}

          {/* Restore Purchases */}
          <TouchableOpacity style={styles.restoreButton} onPress={() => {}}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>
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
  loadingText: {
    fontSize: 18,
    color: "#92400e",
    textAlign: "center",
    marginTop: 50,
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
  gemsDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  gemsIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  gemsCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
  },
  section: {
    marginBottom: 30,
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
  productGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  gemPackage: {
    width: (width - 60) / 3,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  packageGradient: {
    padding: 15,
    alignItems: "center",
    position: "relative",
  },
  packageHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  gemIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  gemAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
  },
  packageTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#92400e",
    textAlign: "center",
    marginBottom: 5,
  },
  packagePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#92400e",
  },
  bonusBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#dc2626",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bonusText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "white",
  },
  bundleCard: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bundleGradient: {
    padding: 20,
  },
  bundleContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bundleInfo: {
    flex: 1,
    marginRight: 15,
  },
  bundleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 5,
  },
  bundleDescription: {
    fontSize: 14,
    color: "#b45309",
    marginBottom: 10,
  },
  powerUpList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  powerUpItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(146, 64, 14, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  powerUpIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  powerUpCount: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#92400e",
  },
  bundlePrice: {
    alignItems: "center",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 8,
  },
  buyButton: {
    backgroundColor: "#92400e",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  featureCard: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  ownedFeature: {
    opacity: 0.8,
  },
  featureGradient: {
    padding: 20,
  },
  featureContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featureInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  featureAction: {
    alignItems: "center",
  },
  ownedBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ownedText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  featurePricing: {
    alignItems: "center",
  },
  featurePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  featureBuyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featureBuyText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  vipCard: {
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  vipHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  vipIcon: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  vipTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#92400e",
    textAlign: "center",
  },
  vipSubtitle: {
    fontSize: 16,
    color: "#92400e",
    textAlign: "center",
    marginBottom: 20,
  },
  vipBenefits: {
    marginBottom: 25,
  },
  vipBenefit: {
    fontSize: 14,
    color: "#92400e",
    marginBottom: 8,
    paddingLeft: 10,
  },
  vipOwnedBadge: {
    backgroundColor: "#10b981",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  vipOwnedText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  vipBuyButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  vipBuyGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  vipBuyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  restoreButton: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  restoreText: {
    fontSize: 14,
    color: "#b45309",
    textDecorationLine: "underline",
  },
})
