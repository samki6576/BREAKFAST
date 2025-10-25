"use client"

import { useState, useEffect } from "react"
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useGame } from "../contexts/GameContext"
import { SoundManager } from "../utils/SoundManager"

const { width } = Dimensions.get("window")
const BOARD_SIZE = width - 60
const BOARD_COLS = 7 // number of columns in the game board
const PIECE_SIZE = (BOARD_SIZE - 28) / BOARD_COLS // BOARD_COLS grid with gaps

interface GamePieceProps {
  piece: any
  row: number
  col: number
  isSelected: boolean
  onPress: () => void
}

interface GameBoardProps {
  onMatch?: () => void
}

const GamePiece = ({ piece, row, col, isSelected, onPress }: GamePieceProps) => {
  const pieceColors = {
    toast: ["#fde68a", "#fbbf24"],
    pancake: ["#fbbf24", "#f59e0b"],
    honey: ["#f59e0b", "#d97706"],
    butter: ["#fef3c7", "#fde047"],
    waffle: ["#fbbf24", "#d97706"],
    syrup: ["#d97706", "#92400e"],
    "burnt-toast": ["#451a03", "#78350f"], // Dark brown
    "melting-butter": ["#fde047", "#facc15"], // Bright yellow with animation
    "sticky-honey": ["#d97706", "#92400e"], // Darker honey
    empty: ["transparent", "transparent"],
  }

  const pieceIcons = {
    toast: "🍞",
    pancake: "🥞",
    honey: "🍯",
    butter: "🧈",
    waffle: "🧇",
    syrup: "🍁",
    "burnt-toast": "🔥",
    "melting-butter": "💧",
    "sticky-honey": "🕸️",
    empty: "",
  }

  if (piece.type === "empty") {
    return <View style={[styles.piece, { backgroundColor: "transparent" }]} />
  }

  return (
    <TouchableOpacity
      style={[styles.piece, isSelected && styles.selectedPiece, piece.special !== "none" && styles.specialPiece]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={pieceColors[piece.type as keyof typeof pieceColors] as unknown as any}
        style={styles.pieceGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Text style={styles.pieceIcon}>{pieceIcons[piece.type as keyof typeof pieceIcons]}</Text>
        {piece.special !== "none" && (
          <View style={styles.specialIndicator}>
            <Text style={styles.specialIcon}>✨</Text>
          </View>
        )}
        {piece.health && piece.health > 1 && (
          <View style={styles.healthIndicator}>
            <Text style={styles.healthText}>{piece.health}</Text>
          </View>
        )}
        {piece.timer && (
          <View style={styles.timerIndicator}>
            <Text style={styles.timerText}>{piece.timer}</Text>
          </View>
        )}
        {piece.sticky && (
          <View style={styles.stickyIndicator}>
            <Text style={styles.stickyIcon}>🕸️</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  )
}

export default function GameBoard({ onMatch }: GameBoardProps) {
  const { gameState, makeMove } = useGame()
  const [selectedPiece, setSelectedPiece] = useState<{ row: number; col: number } | null>(null)
  const [lastScore, setLastScore] = useState(0)

  // Track score changes to play match sounds
  useEffect(() => {
    if (lastScore === 0) {
      setLastScore(gameState.score)
      return
    }

    if (gameState.score > lastScore) {
      const scoreDiff = gameState.score - lastScore

      // Play different sounds based on match size
      if (scoreDiff >= 250) {
        SoundManager.playSound("match5")
      } else if (scoreDiff >= 150) {
        SoundManager.playSound("match4")
      } else {
        SoundManager.playSound("match3")
      }

      // Trigger particle effect
      if (onMatch) onMatch()

      setLastScore(gameState.score)
    }
  }, [gameState.score])

  const handlePiecePress = (row: number, col: number) => {
    if (gameState.gameStatus !== "playing") return

    // Play click sound
    SoundManager.playSound("button_click")

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
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#fde68a", "#fbbf24"]}
        style={styles.boardContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.board}>
          {gameState.board.map((row, rowIndex) =>
            row.map((piece, colIndex) => (
              <GamePiece
                key={`${rowIndex}-${colIndex}-${piece.id}`}
                piece={piece}
                row={rowIndex}
                col={colIndex}
                isSelected={selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex}
                onPress={() => handlePiecePress(rowIndex, colIndex)}
              />
            )),
          )}
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  boardContainer: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    borderRadius: 20,
    padding: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  board: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  piece: {
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    borderRadius: 12,
    marginBottom: 2,
    overflow: "hidden",
  },
  pieceGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pieceIcon: {
    fontSize: PIECE_SIZE * 0.5,
  },
  selectedPiece: {
    borderWidth: 3,
    borderColor: "#f59e0b",
    elevation: 5,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  specialPiece: {
    borderWidth: 2,
    borderColor: "#fde047",
  },
  specialIndicator: {
    position: "absolute",
    top: 2,
    right: 2,
  },
  specialIcon: {
    fontSize: 12,
  },
  healthIndicator: {
    position: "absolute",
    top: 2,
    left: 2,
    backgroundColor: "#dc2626",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  healthText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  timerIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#f59e0b",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  stickyIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(217, 119, 6, 0.3)",
    borderRadius: 12,
  },
  stickyIcon: {
    fontSize: 8,
    position: "absolute",
    top: 2,
    right: 2,
  },
})
