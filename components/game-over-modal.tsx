"use client"

import { motion } from "framer-motion"
import { Heart, Home, RotateCcw } from "lucide-react"

interface GameOverModalProps {
  onRetry: () => void
  onMenu: () => void
  canRetry: boolean
  livesRemaining: number
}

export default function GameOverModal({ onRetry, onMenu, canRetry, livesRemaining }: GameOverModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-b from-amber-50 to-amber-100 p-8 rounded-2xl shadow-xl border-4 border-amber-300 w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-4"
        >
          😔
        </motion.div>

        <h2 className="text-3xl font-bold text-amber-800 mb-2">Game Over</h2>
        <p className="text-amber-700 mb-6">Don't give up! Try again to beat this level.</p>

        <div className="bg-amber-50 p-4 rounded-xl mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-6 h-6 text-red-500" />
            <span className="text-amber-800 font-bold">Lives Remaining: {livesRemaining}</span>
          </div>
          {!canRetry && (
            <p className="text-amber-700 text-sm">Lives refill every 30 minutes or visit the shop to buy more!</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onMenu}
            className="flex-1 bg-gradient-to-b from-amber-300 to-amber-400 px-4 py-3 rounded-xl shadow-md text-amber-900 font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all"
          >
            <Home className="w-5 h-5" />
            Menu
          </button>
          <button
            onClick={onRetry}
            disabled={!canRetry}
            className={`flex-1 px-4 py-3 rounded-xl shadow-md font-bold flex items-center justify-center gap-2 transition-all ${
              canRetry
                ? "bg-gradient-to-b from-amber-400 to-amber-500 text-amber-900 hover:brightness-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            Retry
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
