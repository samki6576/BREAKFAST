"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Trophy, Medal, Award } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import type { Screen } from "@/app/page"

export default function LeaderboardScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { user } = useUser()

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, username: "PancakeMaster", score: 125000, level: 25 },
    { rank: 2, username: "ToastQueen", score: 98500, level: 22 },
    { rank: 3, username: "HoneyKing", score: 87200, level: 20 },
    { rank: 4, username: "WaffleWizard", score: 76800, level: 18 },
    { rank: 5, username: "ButterBoss", score: 65400, level: 16 },
    { rank: 6, username: "SyrupSage", score: 54200, level: 14 },
    { rank: 7, username: "BreakfastBeast", score: 43100, level: 12 },
    { rank: 8, username: user?.username || "You", score: user?.totalScore || 0, level: user?.level || 1 },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-amber-800 font-bold">#{rank}</span>
    }
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
        <h1 className="text-3xl font-bold text-amber-800">Leaderboard</h1>
        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* Leaderboard */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-b from-amber-100 to-amber-200 p-6 rounded-2xl shadow-xl border-4 border-amber-300"
      >
        <div className="space-y-3">
          {leaderboard.map((player, index) => {
            const isCurrentUser = player.username === user?.username
            return (
              <motion.div
                key={player.rank}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl ${
                  isCurrentUser
                    ? "bg-gradient-to-r from-amber-300 to-amber-400 border-2 border-amber-500"
                    : "bg-amber-50"
                } ${player.rank <= 3 ? "ring-2 ring-yellow-400" : ""}`}
              >
                <div className="flex items-center justify-center w-12">{getRankIcon(player.rank)}</div>

                <div className="flex-1">
                  <h3 className={`font-bold ${isCurrentUser ? "text-amber-900" : "text-amber-800"}`}>
                    {player.username}
                    {isCurrentUser && <span className="ml-2 text-sm">(You)</span>}
                  </h3>
                  <p className={`text-sm ${isCurrentUser ? "text-amber-800" : "text-amber-700"}`}>
                    Level {player.level}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`font-bold ${isCurrentUser ? "text-amber-900" : "text-amber-800"}`}>
                    {player.score.toLocaleString()}
                  </p>
                  <p className={`text-sm ${isCurrentUser ? "text-amber-800" : "text-amber-700"}`}>points</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <h3 className="text-lg font-bold text-amber-800 mb-2">Weekly Tournament</h3>
          <p className="text-amber-700 mb-3">Compete with players worldwide! Top 10 players win exclusive rewards.</p>
          <div className="flex justify-between items-center">
            <span className="text-amber-800">Time remaining: 3 days 12 hours</span>
            <button className="bg-gradient-to-b from-amber-400 to-amber-500 px-4 py-2 rounded-lg shadow-md text-amber-900 font-bold hover:brightness-105 transition-all">
              Join Tournament
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
