"use client"

import { motion } from "framer-motion"
import { ArrowLeft, User, Trophy, Coins, Heart, Star, LogOut } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import type { Screen } from "@/app/page"

export default function ProfileScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
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

        <h1 className="text-3xl font-bold text-amber-800">Player Profile</h1>

        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-red-400 to-red-500 rounded-lg shadow-md text-red-900 font-medium hover:brightness-105 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-b from-amber-100 to-amber-200 p-8 rounded-2xl shadow-xl border-4 border-amber-300 mb-8"
      >
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full flex items-center justify-center text-4xl">
            <User className="w-10 h-10 text-amber-900" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-amber-800">{user.username}</h2>
            <p className="text-amber-700">{user.email}</p>
            <p className="text-amber-700">Level {user.level}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-amber-50 p-4 rounded-xl text-center">
            <Trophy className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-900">{user.totalScore.toLocaleString()}</p>
            <p className="text-amber-700 text-sm">Total Score</p>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl text-center">
            <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-900">{user.coins}</p>
            <p className="text-amber-700 text-sm">Coins</p>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-900">{user.lives}</p>
            <p className="text-amber-700 text-sm">Lives</p>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-900">{user.completedLevels.length}</p>
            <p className="text-amber-700 text-sm">Levels Completed</p>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-b from-amber-100 to-amber-200 p-6 rounded-2xl shadow-xl border-4 border-amber-300 mb-8"
      >
        <h3 className="text-2xl font-bold text-amber-800 mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const isUnlocked = user.achievements.includes(achievement.id)
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 ${
                  isUnlocked ? "bg-amber-50 border-amber-300" : "bg-gray-100 border-gray-300 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <h4 className={`font-bold ${isUnlocked ? "text-amber-800" : "text-gray-600"}`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${isUnlocked ? "text-amber-700" : "text-gray-500"}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {isUnlocked && <div className="ml-auto text-green-500">✓</div>}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Daily Rewards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-b from-amber-100 to-amber-200 p-6 rounded-2xl shadow-xl border-4 border-amber-300"
      >
        <h3 className="text-2xl font-bold text-amber-800 mb-4">Daily Rewards</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-800">
              Current Streak: <span className="font-bold">{user.dailyRewardStreak} days</span>
            </p>
            <p className="text-amber-700 text-sm">Come back daily to maintain your streak!</p>
          </div>
          <button className="bg-gradient-to-b from-amber-400 to-amber-500 px-6 py-3 rounded-xl shadow-md text-amber-900 font-bold hover:brightness-105 transition-all">
            Claim Daily Reward
          </button>
        </div>
      </motion.div>
    </div>
  )
}
