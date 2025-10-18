"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, User, Mail } from "lucide-react"
import { useUser } from "@/contexts/user-context"

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const { signIn } = useUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() && email.trim()) {
      signIn(username.trim(), email.trim())
      onClose()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-b from-amber-50 to-amber-100 p-6 rounded-2xl shadow-xl border-4 border-amber-300 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-amber-800">Welcome to Breakfast Blitz!</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-amber-200 transition-colors">
            <X className="w-6 h-6 text-amber-800" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-amber-800 font-medium mb-2">
              <User className="w-5 h-5" />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-400 outline-none"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-amber-800 font-medium mb-2">
              <Mail className="w-5 h-5" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-400 outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-b from-amber-400 to-amber-500 px-4 py-3 rounded-xl shadow-md text-amber-900 font-bold text-lg hover:brightness-105 transition-all"
          >
            Start Playing!
          </button>
        </form>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-amber-700 text-sm">
            🎁 <strong>Welcome Bonus:</strong> Get 100 coins and 5 lives to start your breakfast adventure!
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
