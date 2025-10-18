"use client"

import { motion } from "framer-motion"
import { Star, ArrowRight, RotateCcw } from "lucide-react"
import type { Level } from "@/contexts/game-context"

interface LevelCompleteModalProps {
  level: Level
  score: number
  stars: number
  onNextLevel: () => void
  onRetry: () => void
}

export default function LevelCompleteModal({ level, score, stars, onNextLevel, onRetry }: LevelCompleteModalProps) {
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
          🎉
        </motion.div>

        <h2 className="text-3xl font-bold text-amber-800 mb-2">Level Complete!</h2>
        <p className="text-amber-700 mb-6">{level.name}</p>

        <div className="bg-amber-50 p-4 rounded-xl mb-6">
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + star * 0.1, type: "spring" }}
              >
                <Star className={`w-8 h-8 ${stars >= star ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
              </motion.div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-amber-800">Score:</span>
              <span className="text-amber-900 font-bold">{score.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-800">Target:</span>
              <span className="text-amber-900 font-bold">{level.targetScore.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-800">Coins Earned:</span>
              <span className="text-amber-900 font-bold">+{stars * 10 + Math.floor(score / 1000)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onRetry}
            className="flex-1 bg-gradient-to-b from-amber-300 to-amber-400 px-4 py-3 rounded-xl shadow-md text-amber-900 font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Retry
          </button>
          <button
            onClick={onNextLevel}
            className="flex-1 bg-gradient-to-b from-amber-400 to-amber-500 px-4 py-3 rounded-xl shadow-md text-amber-900 font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all"
          >
            Next Level
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
