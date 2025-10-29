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
  isMatched,
  onClick,
  onPointerDown,
  onPointerUp,
}: {
  piece: Piece
  row: number
  col: number
  isSelected: boolean
  isMatched?: boolean
  onClick: () => void
  onPointerDown?: (e: React.PointerEvent) => void
  onPointerUp?: (e: React.PointerEvent) => void
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
    return <div className="w-8 h-8 sm:w-10 md:w-12 aspect-square" />
  }

  // matched animation: scale up and fade out
  const matchedAnimate = isMatched
    ? { scale: [1, 1.4, 0.8], opacity: [1, 0.8, 0], rotate: [0, 6, 12] }
    : {}

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05 }}
      animate={isSelected ? { y: [0, -5, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.5 } } : matchedAnimate}
      transition={{ duration: isMatched ? 0.36 : 0.2 }}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className={`${pieceColors[piece.type]} w-8 h-8 sm:w-10 md:w-12 aspect-square rounded-lg flex items-center justify-center text-sm sm:text-lg md:text-2xl shadow-md cursor-pointer ${
        isSelected ? "ring-4 ring-amber-500" : ""
      } ${piece.special !== "none" ? "ring-2 ring-yellow-400" : ""}`}
    >
      {pieceIcons[piece.type]}
      {isMatched && (
        // small sparkle emojis that burst from the matched piece
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, y: 0, x: 0, scale: 0.6 }}
              animate={{ opacity: 0, y: -(30 + Math.random() * 40), x: (Math.random() - 0.5) * 40, scale: 1 }}
              transition={{ duration: 0.6 + Math.random() * 0.4, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 text-sm transform -translate-x-1/2 -translate-y-1/2"
            >
              {['✨','💫','⭐','🌟','🎇','🎆'][i % 6]}
            </motion.span>
          ))}
        </div>
      )}
      {piece.special === "striped-h" && <div className="absolute inset-0 bg-yellow-400 opacity-30 rounded-lg" />}
      {piece.special === "striped-v" && <div className="absolute inset-0 bg-yellow-400 opacity-30 rounded-lg" />}
      {piece.special === "wrapped" && <div className="absolute inset-0 border-4 border-yellow-400 rounded-lg" />}
      {piece.special === "color-bomb" && <div className="absolute inset-0 bg-rainbow opacity-50 rounded-lg" />}
    </motion.div>
  )
}

export default function GameBoard() {
  const { gameState, makeMove } = useGame()
  const pointerStartRef = useRef<{ x: number; y: number; row: number; col: number } | null>(null)
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

  // Pointer handlers for swipe-to-swap
  const handlePointerDown = (e: React.PointerEvent, row: number, col: number) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY, row, col }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    const start = pointerStartRef.current
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    const threshold = 20
    if (absX < threshold && absY < threshold) {
      pointerStartRef.current = null
      return
    }

    let targetRow = start.row
    let targetCol = start.col
    if (absX > absY) {
      // horizontal swipe
      targetCol = dx > 0 ? start.col + 1 : start.col - 1
    } else {
      // vertical swipe
      targetRow = dy > 0 ? start.row + 1 : start.row - 1
    }

    // Ensure target is inside board
    if (targetRow >= 0 && targetRow < gameState.board.length && targetCol >= 0 && targetCol < gameState.board[0].length) {
      makeMove(start.row, start.col, targetRow, targetCol)
    }

    pointerStartRef.current = null
  }

  return (
    <div className="bg-gradient-to-b from-amber-100 to-amber-200 p-3 rounded-2xl shadow-xl border-4 border-amber-300 overflow-auto">
      <div style={{ maxWidth: "min(100vw,480px)" }} className="mx-auto">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${gameState.board[0]?.length ?? 8}, minmax(0, 1fr))`,
            alignItems: "stretch",
          }}
        >
          {gameState.board.flat().map((piece, idx) => {
            const cols = gameState.board[0]?.length ?? 8
            const rowIndex = Math.floor(idx / cols)
            const colIndex = idx % cols
            const isMatched = !!gameState.lastMatches?.some((m) => m.row === rowIndex && m.col === colIndex)
            return (
              <GamePiece
                key={piece.id}
                piece={piece}
                row={rowIndex}
                col={colIndex}
                isSelected={selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex}
                isMatched={isMatched}
                onClick={() => handlePieceClick(rowIndex, colIndex)}
                onPointerDown={(e: React.PointerEvent) => handlePointerDown(e, rowIndex, colIndex)}
                onPointerUp={(e: React.PointerEvent) => handlePointerUp(e)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
