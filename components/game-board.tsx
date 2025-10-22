"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useGame } from "@/contexts/game-context"
import { useSettings } from "@/contexts/settings-context"

type PieceType = "toast" | "pancake" | "honey" | "butter" | "waffle" | "syrup" | "empty";
type Piece = {
  id: string | number;
  type: PieceType;
  special?: "none" | "striped-h" | "striped-v" | "wrapped" | "color-bomb";
};

const GamePiece = ({
  piece,
  row,
  col,
  isSelected,
  onClick,
}: {
  piece: Piece
  row: number
  col: number
  isSelected: boolean
  onClick: () => void
}) => {
  const pieceColors: Record<PieceType, string> = {
    toast: "bg-gradient-to-b from-amber-200 to-amber-300",
    pancake: "bg-gradient-to-b from-amber-300 to-amber-400",
    honey: "bg-gradient-to-b from-amber-400 to-amber-500",
    butter: "bg-gradient-to-b from-yellow-200 to-yellow-300",
    waffle: "bg-gradient-to-b from-amber-300 to-amber-500",
    syrup: "bg-gradient-to-b from-amber-600 to-amber-700",
    empty: "bg-transparent",
  }

  const pieceIcons: Record<PieceType, string> = {
    toast: "🍞",
    pancake: "🥞",
    honey: "🍯",
    butter: "🧈",
    waffle: "🧇",
    syrup: "🍁",
    empty: "",
  }

  if (piece.type === "empty") {
    return <div className="w-12 h-12 md:w-14 md:h-14 aspect-square" />
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      animate={isSelected ? { y: [0, -5, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.5 } } : {}}
      onClick={onClick}
      className={`${pieceColors[piece.type]} w-12 h-12 md:w-14 md:h-14 aspect-square rounded-lg flex items-center justify-center text-xl md:text-2xl shadow-md cursor-pointer ${
        isSelected ? "ring-4 ring-amber-500" : ""
      } ${piece.special !== "none" ? "ring-2 ring-yellow-400" : ""}`}
    >
      {pieceIcons[piece.type]}
      {piece.special === "striped-h" && <div className="absolute inset-0 bg-yellow-400 opacity-30 rounded-lg" />}
      {piece.special === "striped-v" && <div className="absolute inset-0 bg-yellow-400 opacity-30 rounded-lg" />}
      {piece.special === "wrapped" && <div className="absolute inset-0 border-4 border-yellow-400 rounded-lg" />}
      {piece.special === "color-bomb" && <div className="absolute inset-0 bg-rainbow opacity-50 rounded-lg" />}
    </motion.div>
  )
}

export default function GameBoard() {
  const { gameState, makeMove } = useGame()
  const [selectedPiece, setSelectedPiece] = useState<{ row: number; col: number } | null>(null)
  const { soundEnabled, soundVolume } = useSettings()
  const clickAudioRef = useRef<HTMLAudioElement | null>(null)
  const matchAudioRef = useRef<HTMLAudioElement | null>(null)
  const [lastScore, setLastScore] = useState(0)

  useEffect(() => {
    try {
      clickAudioRef.current = new Audio("/click.mp3")
      if (clickAudioRef.current) clickAudioRef.current.volume = soundVolume / 100

      // Prefer custom match sound; fall back to click if it fails
      const matchEl = new Audio("/match.mp3")
      matchEl.volume = soundVolume / 100
      matchEl.preload = "auto"
      matchEl.addEventListener("error", () => {
        // Fallback if /match.mp3 is missing or not playable
        matchAudioRef.current = new Audio("/click.mp3")
        if (matchAudioRef.current) matchAudioRef.current.volume = soundVolume / 100
      })
      matchEl.addEventListener("canplaythrough", () => {
        matchAudioRef.current = matchEl
      })
      matchEl.load()
      // If canplaythrough never fires (e.g., very small file), still assign after a short tick
      setTimeout(() => {
        if (!matchAudioRef.current) matchAudioRef.current = matchEl
      }, 300)
    } catch {}
  }, [])

  useEffect(() => {
    if (clickAudioRef.current) clickAudioRef.current.volume = soundVolume / 100
    if (matchAudioRef.current) matchAudioRef.current.volume = soundVolume / 100
    if (soundVolume === 0) {
      try {
        if (clickAudioRef.current) {
          clickAudioRef.current.pause()
          clickAudioRef.current.currentTime = 0
        }
        if (matchAudioRef.current) {
          matchAudioRef.current.pause()
          matchAudioRef.current.currentTime = 0
        }
      } catch {}
    }
  }, [soundVolume])

  // Stop any ongoing sounds when sound is disabled
  useEffect(() => {
    if (!soundEnabled) {
      try {
        if (clickAudioRef.current) {
          clickAudioRef.current.pause()
          clickAudioRef.current.currentTime = 0
        }
        if (matchAudioRef.current) {
          matchAudioRef.current.pause()
          matchAudioRef.current.currentTime = 0
        }
      } catch {}
    }
  }, [soundEnabled])

  useEffect(() => {
    if (lastScore === 0) {
      setLastScore(gameState.score)
      return
    }
    if (gameState.score > lastScore) {
      // Haptic feedback on match
      try {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate?.(soundEnabled ? 20 : 0)
        }
      } catch {}
      if (soundEnabled && soundVolume > 0 && matchAudioRef.current) {
        try {
          matchAudioRef.current.currentTime = 0
          matchAudioRef.current.play()
        } catch {}
      }
      setLastScore(gameState.score)
    }
  }, [gameState.score, lastScore, soundEnabled])

  const handlePieceClick = useCallback((row: number, col: number) => {
    if (gameState.gameStatus !== "playing") return

    // Haptic feedback on tap
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(10)
      }
    } catch {}

    if (soundEnabled && soundVolume > 0 && clickAudioRef.current) {
      try {
        clickAudioRef.current.currentTime = 0
        clickAudioRef.current.play()
      } catch {}
    }

    if (selectedPiece === null) {
      setSelectedPiece({ row, col })
      return
    }

    if (selectedPiece.row === row && selectedPiece.col === col) {
      setSelectedPiece(null)
      return
    }

    // Check if pieces are adjacent
    const isAdjacent =
      (Math.abs(selectedPiece.row - row) === 1 && selectedPiece.col === col) ||
      (Math.abs(selectedPiece.col - col) === 1 && selectedPiece.row === row)

    if (isAdjacent) {
      makeMove(selectedPiece.row, selectedPiece.col, row, col)
      setSelectedPiece(null)
    } else {
      setSelectedPiece({ row, col })
    }
  }, [gameState.gameStatus, selectedPiece, soundEnabled, soundVolume, makeMove])

  return (
    <div className="bg-gradient-to-b from-amber-100 to-amber-200 p-4 rounded-2xl shadow-xl border-4 border-amber-300">
      <div className="grid grid-cols-8 md:grid-cols-8 gap-1 auto-rows-fr justify-center">
        {gameState.board.map((row, rowIndex) => (
          <>
            {row.map((piece, colIndex) => (
              <GamePiece
                key={`${rowIndex}-${colIndex}-${piece.id}`}
                piece={piece}
                row={rowIndex}
                col={colIndex}
                isSelected={selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex}
                onClick={() => handlePieceClick(rowIndex, colIndex)}
              />
            ))}
          </>
        ))}
      </div>
    </div>
  )
}
