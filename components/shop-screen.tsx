"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Coins, Heart, Hammer, Shuffle, Plus, Bomb, ShoppingCart } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import type { Screen } from "@/app/page"
import { track } from "@/lib/analytics"

export default function ShopScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { user, spendCoins, updateUser } = useUser()

  const shopItems = [
    {
      id: "lives-5",
      name: "5 Lives",
      description: "Refill your lives instantly",
      icon: <Heart className="w-8 h-8 text-red-500" />,
      price: 50,
      type: "lives" as const,
      amount: 5,
    },
    {
      id: "hammer-3",
      name: "3 Hammers",
      description: "Remove any piece from the board",
      icon: <Hammer className="w-8 h-8 text-amber-600" />,
      price: 30,
      type: "powerup" as const,
      powerup: "hammer",
      amount: 3,
    },
    {
      id: "shuffle-2",
      name: "2 Shuffles",
      description: "Shuffle the entire board",
      icon: <Shuffle className="w-8 h-8 text-amber-600" />,
      price: 40,
      type: "powerup" as const,
      powerup: "shuffle",
      amount: 2,
    },
    {
      id: "extra-moves-3",
      name: "3 Extra Moves",
      description: "Add 5 moves to any level",
      icon: <Plus className="w-8 h-8 text-amber-600" />,
      price: 35,
      type: "powerup" as const,
      powerup: "extraMoves",
      amount: 3,
    },
    {
      id: "color-bomb-2",
      name: "2 Color Bombs",
      description: "Clear all pieces of one color",
      icon: <Bomb className="w-8 h-8 text-amber-600" />,
      price: 60,
      type: "powerup" as const,
      powerup: "colorBomb",
      amount: 2,
    },
    {
      id: "coins-100",
      name: "100 Coins",
      description: "Get more coins for purchases",
      icon: <Coins className="w-8 h-8 text-yellow-600" />,
      price: 0, // Free with ads
      type: "coins" as const,
      amount: 100,
      watchAd: true,
    },
  ]

  const handlePurchase = (item: (typeof shopItems)[0]) => {
    if (!user) return

    if (item.watchAd) {
      // Simulate watching an ad
      updateUser({ coins: user.coins + item.amount })
      track({ type: "purchase", itemId: item.id, amount: 0 })
      return
    }

    if (!spendCoins(item.price)) {
      alert("Not enough coins!")
      return
    }

    switch (item.type) {
      case "lives":
        updateUser({ lives: Math.min(5, user.lives + item.amount) })
        track({ type: "purchase", itemId: item.id, amount: item.price })
        break
      case "coins":
        updateUser({ coins: user.coins + item.amount })
        track({ type: "purchase", itemId: item.id, amount: item.price })
        break
      case "powerup":
        // This would update game context power-ups in a real implementation
        alert(`Purchased ${item.amount} ${item.name}!`)
        track({ type: "purchase", itemId: item.id, amount: item.price })
        break
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="bg-amber-50 p-8 rounded-2xl shadow-md border-2 border-amber-200">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Please sign in to access the Shop</h2>
          <p className="text-amber-700 mb-6">Sign in to save purchases and earn rewards.</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("menu")}
              className="px-4 py-2 bg-gradient-to-b from-amber-400 to-amber-500 text-amber-900 font-bold rounded-lg"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate("menu")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-amber-300 to-amber-400 rounded-lg shadow-md text-amber-900 font-medium hover:brightness-105 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-amber-800">Shop</h1>

        <div className="flex items-center gap-2 bg-gradient-to-b from-amber-200 to-amber-300 px-4 py-2 rounded-lg shadow-md">
          <Coins className="w-5 h-5 text-yellow-600" />
          <span className="text-amber-900 font-bold">{user.coins}</span>
        </div>
      </div>

      {/* Shop Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-b from-amber-100 to-amber-200 p-6 rounded-2xl shadow-xl border-4 border-amber-300"
          >
            <div className="text-center mb-4">
              {item.icon}
              <h3 className="text-xl font-bold text-amber-800 mt-2">{item.name}</h3>
              <p className="text-amber-700 text-sm mt-1">{item.description}</p>
            </div>

            <div className="text-center mb-4">
              {item.watchAd ? (
                <div className="bg-green-100 px-3 py-2 rounded-lg">
                  <span className="text-green-800 font-bold">Watch Ad</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-600" />
                  <span className="text-2xl font-bold text-amber-900">{item.price}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => handlePurchase(item)}
              disabled={!item.watchAd && user.coins < item.price}
              className={`w-full px-4 py-3 rounded-xl shadow-md font-bold flex items-center justify-center gap-2 transition-all ${
                item.watchAd
                  ? "bg-gradient-to-b from-green-400 to-green-500 text-green-900 hover:brightness-105"
                  : user.coins >= item.price
                    ? "bg-gradient-to-b from-amber-400 to-amber-500 text-amber-900 hover:brightness-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {item.watchAd ? "Watch Ad" : "Buy Now"}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Special Offers */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-gradient-to-b from-amber-100 to-amber-200 p-6 rounded-2xl shadow-xl border-4 border-amber-300"
      >
        <h3 className="text-2xl font-bold text-amber-800 mb-4">🎁 Daily Deals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-300">
            <h4 className="font-bold text-amber-800 mb-2">Starter Pack</h4>
            <p className="text-amber-700 text-sm mb-3">Perfect for new players!</p>
            <div className="flex items-center justify-between">
              <span className="text-amber-800">5 Lives + 3 Power-ups</span>
              <button className="bg-gradient-to-b from-amber-400 to-amber-500 px-3 py-2 rounded-lg text-amber-900 font-bold text-sm">
                80 Coins
              </button>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-300">
            <h4 className="font-bold text-amber-800 mb-2">Power Player Pack</h4>
            <p className="text-amber-700 text-sm mb-3">For serious players!</p>
            <div className="flex items-center justify-between">
              <span className="text-amber-800">10 Power-ups + 200 Coins</span>
              <button className="bg-gradient-to-b from-amber-400 to-amber-500 px-3 py-2 rounded-lg text-amber-900 font-bold text-sm">
                150 Coins
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
