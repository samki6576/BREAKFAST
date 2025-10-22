"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { Settings, Play, User, Trophy, ShoppingCart, Heart, Coins } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import SettingsModal from "./settings-modal"
import LoginModal from "./login-modal"
import type { Screen } from "@/app/page"

export default function MainMenu({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [showSettings, setShowSettings] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const { user, signOut } = useUser()
  const buttonVariants: Variants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(234, 179, 8, 0.3)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  }

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center">
      {/* User info bar */}
      {user && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-4 right-4 bg-gradient-to-r from-amber-200 to-amber-300 p-4 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-amber-900 font-bold">{user.username}</p>
              <p className="text-amber-800 text-sm">Level {user.level}</p>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-amber-900 font-bold">{user.lives}</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-600" />
              <span className="text-amber-900 font-bold">{user.coins}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Decorative elements */}
      <motion.div
        className="absolute text-8xl top-10 left-10 opacity-70"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 4,
          ease: "easeInOut",
        }}
      >
        🍞
      </motion.div>

      <motion.div
        className="absolute text-8xl bottom-10 right-10 opacity-70"
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 5,
          ease: "easeInOut",
        }}
      >
        🥞
      </motion.div>

      <motion.div
        className="absolute text-8xl top-10 right-20 opacity-70"
        animate={{
          y: [0, 15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 6,
          ease: "easeInOut",
        }}
      >
        🧈
      </motion.div>

      <motion.div
        className="absolute text-8xl bottom-20 left-20 opacity-70"
        animate={{
          y: [0, -15, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 5.5,
          ease: "easeInOut",
        }}
      >
        🍯
      </motion.div>

      {/* Logo */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="mb-12 text-center"
      >
        <h1 className="text-6xl md:text-7xl font-bold text-amber-800 drop-shadow-lg">Breakfast Blitz</h1>
        <p className="text-amber-700 mt-4 text-xl">A buttery match-3 adventure</p>
      </motion.div>

  {/* Menu buttons */}
  <div className="flex flex-col gap-4 w-64 sm:w-80 md:w-64 z-10 mx-4 sm:mx-auto">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => (user ? onNavigate("game") : setShowLogin(true))}
          className="bg-gradient-to-b from-amber-400 to-amber-500 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg text-amber-900 font-bold text-lg sm:text-xl flex items-center justify-center gap-3 w-full"
        >
          <Play className="w-6 h-6" /> Play
        </motion.button>

        {/* Story Mode button removed */}

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => onNavigate("leaderboard")}
          className="bg-gradient-to-b from-amber-300 to-amber-400 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg text-amber-900 font-bold text-lg sm:text-xl flex items-center justify-center gap-3 w-full"
        >
          <Trophy className="w-6 h-6" /> Leaderboard
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => onNavigate("shop")}
          className="bg-gradient-to-b from-amber-300 to-amber-400 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg text-amber-900 font-bold text-lg sm:text-xl flex items-center justify-center gap-3 w-full"
        >
          <ShoppingCart className="w-6 h-6" /> Shop
        </motion.button>

        <motion.button
          
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setShowSettings(true)}
          className="bg-gradient-to-b from-amber-200 to-amber-300 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg text-amber-900 font-bold text-lg sm:text-xl flex items-center justify-center gap-3 w-full"
        >
          <Settings className="w-6 h-6" /> Settings
        </motion.button>

        {user ? (
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => onNavigate("profile")}
            className="bg-gradient-to-b from-amber-200 to-amber-300 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg text-amber-900 font-bold text-lg sm:text-xl flex items-center justify-center gap-3 w-full"
          >
            <User className="w-6 h-6" /> Profile
          </motion.button>
        ) : (
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => setShowLogin(true)}
            className="bg-gradient-to-b from-green-400 to-green-500 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg text-green-900 font-bold text-lg sm:text-xl flex items-center justify-center gap-3 w-full"
          >
            <User className="w-6 h-6" /> Sign In
          </motion.button>
        )}
      </div>

      {/* Dripping honey animation */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-4 bg-gradient-to-b from-amber-400 to-amber-500 rounded-b-full mx-2"
            initial={{ height: 0 }}
            animate={{
              height: [0, Math.random() * 60 + 40, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: Math.random() * 4 + 6,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Modals */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
