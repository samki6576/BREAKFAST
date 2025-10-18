"use client"

import { motion } from "framer-motion"
import { Lock, CheckCircle } from "lucide-react"

type LevelProps = {
  number: number
  name: string
  isCompleted: boolean
  isLocked: boolean
  position: { x: number; y: number }
}

const Level = ({ number, name, isCompleted, isLocked, position }: LevelProps) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={!isLocked ? { scale: 1.1 } : {}}
      className={`absolute ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <div
        className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center 
        ${
          isCompleted
            ? "bg-gradient-to-b from-amber-300 to-amber-400"
            : isLocked
              ? "bg-gradient-to-b from-gray-300 to-gray-400"
              : "bg-gradient-to-b from-amber-200 to-amber-300"
        } 
        shadow-lg border-4 ${isCompleted ? "border-yellow-400" : isLocked ? "border-gray-500" : "border-amber-400"}`}
      >
        {isLocked ? (
          <Lock className="w-8 h-8 text-gray-600" />
        ) : isCompleted ? (
          <CheckCircle className="w-8 h-8 text-amber-800" />
        ) : (
          <span className="text-2xl font-bold text-amber-800">{number}</span>
        )}
      </div>

      <div className="mt-2 text-center">
        <p className={`font-bold ${isLocked ? "text-gray-600" : "text-amber-800"}`}>{name}</p>
      </div>
    </motion.div>
  )
}

export default function LevelMap() {
  const levels = [
    { number: 1, name: "Toast Town", isCompleted: true, isLocked: false, position: { x: 20, y: 80 } },
    { number: 2, name: "Pancake Plains", isCompleted: true, isLocked: false, position: { x: 35, y: 65 } },
    { number: 3, name: "Butter Boulevard", isCompleted: false, isLocked: false, position: { x: 50, y: 50 } },
    { number: 4, name: "Honey Hills", isCompleted: false, isLocked: true, position: { x: 65, y: 35 } },
    { number: 5, name: "Waffle Woods", isCompleted: false, isLocked: true, position: { x: 80, y: 20 } },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-800">Breakfast World</h2>
        <p className="text-amber-700 mt-2">Journey through delicious lands of morning treats!</p>
      </div>

      <div className="relative h-[500px] bg-gradient-to-b from-amber-50 to-amber-100 rounded-xl shadow-xl border-4 border-amber-300 overflow-hidden">
        {/* Map decorations */}
        <div className="absolute top-[15%] left-[10%] w-20 h-20 text-6xl">🍞</div>
        <div className="absolute top-[25%] right-[15%] w-20 h-20 text-6xl">🥞</div>
        <div className="absolute bottom-[20%] left-[25%] w-20 h-20 text-6xl">🧈</div>
        <div className="absolute top-[60%] right-[30%] w-20 h-20 text-6xl">🍯</div>
        <div className="absolute top-[10%] right-[40%] w-20 h-20 text-6xl">🧇</div>

        {/* Path */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M20,80 Q28,72 35,65 T50,50 T65,35 T80,20"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeDasharray="5,5"
            strokeLinecap="round"
          />
        </svg>

        {/* Levels */}
        {levels.map((level, index) => (
          <Level key={index} {...level} />
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-b from-amber-50 to-amber-100 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-amber-800 mb-4">World Progress</h3>
        <div className="flex items-center gap-2">
          <div className="bg-amber-200 h-4 rounded-full flex-1 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-yellow-400 h-full rounded-full"
              style={{ width: "40%" }}
            ></div>
          </div>
          <span className="text-amber-800 font-bold">40%</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-amber-800">
              <span className="font-bold">Stars Collected:</span> 7/15
            </p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-amber-800">
              <span className="font-bold">Levels Completed:</span> 2/5
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
