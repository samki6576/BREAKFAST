"use client"

import React from "react"

import * as InAppPurchases from "expo-in-app-purchases"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from "react-native"

export interface PurchaseProduct {
  productId: string
  price: string
  title: string
  description: string
  type: "consumable" | "non_consumable" | "subscription"
  gems?: number
  coins?: number
  powerUps?: Record<string, number>
  features?: string[]
}

export interface PremiumFeatures {
  adFree: boolean
  premiumThemes: boolean
  extraLives: boolean
  exclusivePowerUps: boolean
  vipMembership: boolean
  dailyBonusMultiplier: number
}

class PurchaseManagerClass {
  private products: PurchaseProduct[] = []
  private premiumFeatures: PremiumFeatures = {
    adFree: false,
    premiumThemes: false,
    extraLives: false,
    exclusivePowerUps: false,
    vipMembership: false,
    dailyBonusMultiplier: 1,
  }
  private gems = 0
  private initialized = false

  // Product IDs for different platforms
  private productIds = {
    // Consumable products
    gems_small: Platform.OS === "ios" ? "com.breakfastblitz.gems.small" : "gems_small",
    gems_medium: Platform.OS === "ios" ? "com.breakfastblitz.gems.medium" : "gems_medium",
    gems_large: Platform.OS === "ios" ? "com.breakfastblitz.gems.large" : "gems_large",
    powerup_bundle_starter: Platform.OS === "ios" ? "com.breakfastblitz.powerups.starter" : "powerup_bundle_starter",
    powerup_bundle_pro: Platform.OS === "ios" ? "com.breakfastblitz.powerups.pro" : "powerup_bundle_pro",
    powerup_bundle_ultimate: Platform.OS === "ios" ? "com.breakfastblitz.powerups.ultimate" : "powerup_bundle_ultimate",

    // Non-consumable products
    remove_ads: Platform.OS === "ios" ? "com.breakfastblitz.removeads" : "remove_ads",
    premium_themes: Platform.OS === "ios" ? "com.breakfastblitz.themes" : "premium_themes",
    extra_lives: Platform.OS === "ios" ? "com.breakfastblitz.extralives" : "extra_lives",
    exclusive_powerups: Platform.OS === "ios" ? "com.breakfastblitz.exclusivepowerups" : "exclusive_powerups",

    // Subscription
    vip_membership: Platform.OS === "ios" ? "com.breakfastblitz.vip.monthly" : "vip_membership",
  }

  async initialize() {
    if (this.initialized) return

    try {
      // Connect to store
      await InAppPurchases.connectAsync()

      // Load saved premium features and gems
      await this.loadPurchaseData()

      // Get products from store
      await this.loadProducts()

      // Set up purchase listener
      InAppPurchases.setPurchaseListener(this.handlePurchase.bind(this))

      this.initialized = true
      console.log("Purchase manager initialized")
    } catch (error) {
      console.error("Failed to initialize purchase manager:", error)
    }
  }

  private async loadProducts() {
    try {
      const productIds = Object.values(this.productIds)
      const { results } = await InAppPurchases.getProductsAsync(productIds)

      this.products = results.map((product) => {
        const productConfig = this.getProductConfig(product.productId)
        return {
          productId: product.productId,
          price: product.price || "$0.99",
          title: product.title || productConfig.title,
          description: product.description || productConfig.description,
          type: productConfig.type,
          gems: productConfig.gems,
          coins: productConfig.coins,
          powerUps: productConfig.powerUps,
          features: productConfig.features,
        }
      })

      console.log("Loaded products:", this.products.length)
    } catch (error) {
      console.error("Failed to load products:", error)
      // Fallback to mock products for development
      this.loadMockProducts()
    }
  }

  private getProductConfig(productId: string) {
    const configs = {
      [this.productIds.gems_small]: {
        title: "Handful of Gems",
        description: "100 premium gems",
        type: "consumable" as const,
        gems: 100,
      },
      [this.productIds.gems_medium]: {
        title: "Bag of Gems",
        description: "500 premium gems + 50 bonus",
        type: "consumable" as const,
        gems: 550,
      },
      [this.productIds.gems_large]: {
        title: "Treasure Chest",
        description: "1200 premium gems + 300 bonus",
        type: "consumable" as const,
        gems: 1500,
      },
      [this.productIds.powerup_bundle_starter]: {
        title: "Starter Power Pack",
        description: "Essential power-ups for new players",
        type: "consumable" as const,
        powerUps: { hammer: 5, shuffle: 3, extraMoves: 3 },
      },
      [this.productIds.powerup_bundle_pro]: {
        title: "Pro Power Pack",
        description: "Advanced power-ups for serious players",
        type: "consumable" as const,
        powerUps: { baconBomb: 3, mapleSyrup: 2, colorBomb: 2, coffeeBoost: 5 },
      },
      [this.productIds.powerup_bundle_ultimate]: {
        title: "Ultimate Power Pack",
        description: "All power-ups + exclusive items",
        type: "consumable" as const,
        powerUps: { hammer: 10, baconBomb: 5, mapleSyrup: 5, colorBomb: 5, coffeeBoost: 10 },
        gems: 200,
      },
      [this.productIds.remove_ads]: {
        title: "Remove Ads",
        description: "Enjoy uninterrupted gameplay",
        type: "non_consumable" as const,
        features: ["adFree"],
      },
      [this.productIds.premium_themes]: {
        title: "Premium Themes",
        description: "Unlock exclusive breakfast themes",
        type: "non_consumable" as const,
        features: ["premiumThemes"],
      },
      [this.productIds.extra_lives]: {
        title: "Infinite Lives",
        description: "Never run out of lives again",
        type: "non_consumable" as const,
        features: ["extraLives"],
      },
      [this.productIds.exclusive_powerups]: {
        title: "Exclusive Power-ups",
        description: "Access to VIP-only power-ups",
        type: "non_consumable" as const,
        features: ["exclusivePowerUps"],
      },
      [this.productIds.vip_membership]: {
        title: "VIP Membership",
        description: "All premium features + daily bonuses",
        type: "subscription" as const,
        features: ["vipMembership", "adFree", "premiumThemes", "extraLives", "exclusivePowerUps"],
      },
    }

    return (
      configs[productId] || {
        title: "Unknown Product",
        description: "Product description",
        type: "consumable" as const,
      }
    )
  }

  private loadMockProducts() {
    // Mock products for development/testing
    this.products = [
      {
        productId: this.productIds.gems_small,
        price: "$0.99",
        title: "Handful of Gems",
        description: "100 premium gems",
        type: "consumable",
        gems: 100,
      },
      {
        productId: this.productIds.gems_medium,
        price: "$4.99",
        title: "Bag of Gems",
        description: "500 premium gems + 50 bonus",
        type: "consumable",
        gems: 550,
      },
      {
        productId: this.productIds.gems_large,
        price: "$9.99",
        title: "Treasure Chest",
        description: "1200 premium gems + 300 bonus",
        type: "consumable",
        gems: 1500,
      },
      {
        productId: this.productIds.powerup_bundle_starter,
        price: "$2.99",
        title: "Starter Power Pack",
        description: "Essential power-ups for new players",
        type: "consumable",
        powerUps: { hammer: 5, shuffle: 3, extraMoves: 3 },
      },
      {
        productId: this.productIds.powerup_bundle_pro,
        price: "$7.99",
        title: "Pro Power Pack",
        description: "Advanced power-ups for serious players",
        type: "consumable",
        powerUps: { baconBomb: 3, mapleSyrup: 2, colorBomb: 2, coffeeBoost: 5 },
      },
      {
        productId: this.productIds.remove_ads,
        price: "$3.99",
        title: "Remove Ads",
        description: "Enjoy uninterrupted gameplay",
        type: "non_consumable",
        features: ["adFree"],
      },
      {
        productId: this.productIds.vip_membership,
        price: "$9.99/month",
        title: "VIP Membership",
        description: "All premium features + daily bonuses",
        type: "subscription",
        features: ["vipMembership", "adFree", "premiumThemes", "extraLives", "exclusivePowerUps"],
      },
    ]
  }

  private async handlePurchase({ responseCode, results, errorCode }: any) {
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      for (const purchase of results) {
        await this.processPurchase(purchase)
      }
    } else {
      console.error("Purchase failed:", errorCode)
    }
  }

  private async processPurchase(purchase: any) {
    try {
      const product = this.products.find((p) => p.productId === purchase.productId)
      if (!product) return

      // Award gems
      if (product.gems) {
        this.gems += product.gems
      }

      // Award power-ups
      if (product.powerUps) {
        // This would integrate with your game context to add power-ups
        console.log("Awarding power-ups:", product.powerUps)
      }

      // Unlock features
      if (product.features) {
        for (const feature of product.features) {
          this.premiumFeatures[feature as keyof PremiumFeatures] = true
        }
      }

      // Save purchase data
      await this.savePurchaseData()

      // Acknowledge purchase
      await InAppPurchases.finishTransactionAsync(purchase, true)

      console.log("Purchase processed successfully:", product.title)
    } catch (error) {
      console.error("Failed to process purchase:", error)
    }
  }

  async purchaseProduct(productId: string) {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      await InAppPurchases.purchaseItemAsync(productId)
    } catch (error) {
      console.error("Purchase failed:", error)
      throw error
    }
  }

  async restorePurchases() {
    try {
      const { results } = await InAppPurchases.getPurchaseHistoryAsync()

      for (const purchase of results) {
        const product = this.products.find((p) => p.productId === purchase.productId)
        if (product && product.type === "non_consumable" && product.features) {
          for (const feature of product.features) {
            this.premiumFeatures[feature as keyof PremiumFeatures] = true
          }
        }
      }

      await this.savePurchaseData()
      console.log("Purchases restored")
    } catch (error) {
      console.error("Failed to restore purchases:", error)
    }
  }

  private async loadPurchaseData() {
    try {
      const data = await AsyncStorage.getItem("purchase_data")
      if (data) {
        const { premiumFeatures, gems } = JSON.parse(data)
        this.premiumFeatures = { ...this.premiumFeatures, ...premiumFeatures }
        this.gems = gems || 0
      }
    } catch (error) {
      console.error("Failed to load purchase data:", error)
    }
  }

  private async savePurchaseData() {
    try {
      const data = {
        premiumFeatures: this.premiumFeatures,
        gems: this.gems,
      }
      await AsyncStorage.setItem("purchase_data", JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save purchase data:", error)
    }
  }

  // Spend gems
  spendGems(amount: number): boolean {
    if (this.gems >= amount) {
      this.gems -= amount
      this.savePurchaseData()
      return true
    }
    return false
  }

  // Add gems (for rewards, etc.)
  addGems(amount: number) {
    this.gems += amount
    this.savePurchaseData()
  }

  // Getters
  getProducts() {
    return this.products
  }

  getGems() {
    return this.gems
  }

  getPremiumFeatures() {
    return this.premiumFeatures
  }

  hasFeature(feature: keyof PremiumFeatures): boolean {
    return this.premiumFeatures[feature] === true
  }

  async disconnect() {
    if (this.initialized) {
      await InAppPurchases.disconnectAsync()
      this.initialized = false
    }
  }
}

export const PurchaseManager = new PurchaseManagerClass()

// React hook for using purchase manager
export function usePurchaseManager() {
  const [isReady, setIsReady] = React.useState(false)
  const [products, setProducts] = React.useState<PurchaseProduct[]>([])
  const [gems, setGems] = React.useState(0)
  const [premiumFeatures, setPremiumFeatures] = React.useState<PremiumFeatures>({
    adFree: false,
    premiumThemes: false,
    extraLives: false,
    exclusivePowerUps: false,
    vipMembership: false,
    dailyBonusMultiplier: 1,
  })

  React.useEffect(() => {
    const initPurchases = async () => {
      await PurchaseManager.initialize()
      setProducts(PurchaseManager.getProducts())
      setGems(PurchaseManager.getGems())
      setPremiumFeatures(PurchaseManager.getPremiumFeatures())
      setIsReady(true)
    }

    initPurchases()

    return () => {
      // Cleanup handled by singleton
    }
  }, [])

  const purchaseProduct = async (productId: string) => {
    try {
      await PurchaseManager.purchaseProduct(productId)
      // Refresh state after purchase
      setGems(PurchaseManager.getGems())
      setPremiumFeatures(PurchaseManager.getPremiumFeatures())
    } catch (error) {
      throw error
    }
  }

  const spendGems = (amount: number) => {
    const success = PurchaseManager.spendGems(amount)
    if (success) {
      setGems(PurchaseManager.getGems())
    }
    return success
  }

  return {
    isReady,
    products,
    gems,
    premiumFeatures,
    purchaseProduct,
    spendGems,
    restorePurchases: PurchaseManager.restorePurchases.bind(PurchaseManager),
    hasFeature: PurchaseManager.hasFeature.bind(PurchaseManager),
  }
}
