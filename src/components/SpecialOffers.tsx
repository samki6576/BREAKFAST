"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { usePurchaseManager } from "../utils/PurchaseManager"
import { SoundManager } from "../utils/SoundManager"

interface SpecialOffer {
  id: string
  title: string
  description: string
  originalPrice: string
  salePrice: string
  discount: number
  timeLeft: number // in seconds
  productId: string
  icon: string
}

interface SpecialOffersProps {
  visible: boolean
  onClose: () => void
}

export default function SpecialOffers({ visible, onClose }: SpecialOffersProps) {
  const { purchaseProduct } = usePurchaseManager()
  const [offers, setOffers] = useState<SpecialOffer[]>([
    {
      id: "flash_gems",
      title: "Flash Gem Sale!",
      description: "Limited time: 50% more gems",
      originalPrice: "$4.99",
      salePrice: "$2.99",
      discount: 40,
      timeLeft: 3600, // 1 hour
      productId: "gems_medium",
      icon: "💎",
    },
    {
      id: "starter_bundle",
      title: "New Player Special",
      description: "Perfect starter bundle",
      originalPrice: "$9.99",
      salePrice: "$4.99",
      discount: 50,
      timeLeft: 7200, // 2 hours
      productId: "powerup_bundle_starter",
      icon: "🎁",
    },
  ])

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setOffers((prevOffers) =>
        prevOffers
          .map((offer) => ({
            ...offer,
            timeLeft: Math.max(0, offer.timeLeft - 1),
          }))
          .filter((offer) => offer.timeLeft > 0),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const handlePurchase = async (offer: SpecialOffer) => {
    try {
      SoundManager.playSound("button_click")
      await purchaseProduct(offer.productId)
      SoundManager.playSound("level_complete")
      onClose()
    } catch (error) {
      console.error("Purchase failed:", error)
    }
  }

  if (offers.length === 0) {
    return null
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <LinearGradient colors={["#dc2626", "#b91c1c", "#991b1b"]} style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>🔥 SPECIAL OFFERS 🔥</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Limited time deals - Don't miss out!</Text>

          {offers.map((offer) => (
            <View key={offer.id} style={styles.offerCard}>
              <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.offerGradient}>
                <View style={styles.offerHeader}>
                  <Text style={styles.offerIcon}>{offer.icon}</Text>
                  <View style={styles.offerInfo}>
                    <Text style={styles.offerTitle}>{offer.title}</Text>
                    <Text style={styles.offerDescription}>{offer.description}</Text>
                  </View>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{offer.discount}% OFF</Text>
                  </View>
                </View>

                <View style={styles.offerDetails}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>{offer.originalPrice}</Text>
                    <Text style={styles.salePrice}>{offer.salePrice}</Text>
                  </View>

                  <View style={styles.timerContainer}>
                    <Text style={styles.timerLabel}>Time left:</Text>
                    <Text style={styles.timerText}>{formatTime(offer.timeLeft)}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.buyButton} onPress={() => handlePurchase(offer)} activeOpacity={0.8}>
                  <LinearGradient colors={["#dc2626", "#b91c1c"]} style={styles.buyGradient}>
                    <Text style={styles.buyText}>BUY NOW!</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          ))}

          <Text style={styles.disclaimer}>* Offers are limited time only and may not be repeated</Text>
        </LinearGradient>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 25,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 20,
  },
  offerCard: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  offerGradient: {
    padding: 20,
  },
  offerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  offerIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  offerInfo: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 5,
  },
  offerDescription: {
    fontSize: 14,
    color: "#b45309",
  },
  discountBadge: {
    backgroundColor: "#dc2626",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  offerDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: 16,
    color: "#b45309",
    textDecorationLine: "line-through",
    marginRight: 10,
  },
  salePrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#dc2626",
  },
  timerContainer: {
    alignItems: "center",
  },
  timerLabel: {
    fontSize: 12,
    color: "#b45309",
  },
  timerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#dc2626",
  },
  buyButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  buyGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  buyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  disclaimer: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginTop: 10,
  },
})
