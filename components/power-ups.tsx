"use client"

import { motion } from "framer-motion"

const PowerUpCard = ({
  title,
  icon,
  description,
  color,
}: {
  title: string
  icon: string
  description: string
  color: string
}) => {
  return (
    <motion.div whileHover={{ y: -5 }} className={`${color} p-6 rounded-xl shadow-lg`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">{icon}</div>
        <h3 className="text-xl font-bold text-amber-900">{title}</h3>
      </div>
      <p className="text-amber-800">{description}</p>
    </motion.div>
  )
}

export default function PowerUps() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-800">Special Power-ups</h2>
        <p className="text-amber-700 mt-2">Unlock these delicious abilities to master the game!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <PowerUpCard
          title="Butter Bomb"
          icon="🧈"
          description="Clears an entire row of pieces, creating a buttery explosion that earns bonus points!"
          color="bg-gradient-to-b from-yellow-100 to-yellow-200"
        />

        <PowerUpCard
          title="Honey Drip"
          icon="🍯"
          description="Sticks candies together, allowing you to move multiple pieces at once for combo chains."
          color="bg-gradient-to-b from-amber-100 to-amber-200"
        />

        <PowerUpCard
          title="Golden Toast"
          icon="🍞"
          description="Breaks through obstacles and special blockers with a satisfying crunch!"
          color="bg-gradient-to-b from-amber-200 to-amber-300"
        />
      </div>

      <div className="mt-12 bg-gradient-to-b from-amber-50 to-amber-100 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-amber-800 mb-4">How to Use Power-ups</h3>

        <ol className="list-decimal list-inside space-y-4 text-amber-800">
          <li>
            <strong>Collect matches:</strong> Create matches of 4 or more identical pieces to generate power-ups.
          </li>
          <li>
            <strong>Activate:</strong> Tap on a power-up to select it, then choose where to use its special ability.
          </li>
          <li>
            <strong>Combine:</strong> Try combining different power-ups for spectacular breakfast-themed chain
            reactions!
          </li>
        </ol>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-amber-700 italic">
            <strong>Pro Tip:</strong> Save your power-ups for tricky situations or to complete level objectives faster!
          </p>
        </div>
      </div>
    </div>
  )
}
