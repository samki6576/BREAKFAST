"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type PieceType = "toast" | "pancake" | "honey" | "butter" | "waffle" | "syrup" | "empty"
export type SpecialType = "none" | "striped-h" | "striped-v" | "wrapped" | "color-bomb"

export interface GamePiece {
  type: PieceType
  special: SpecialType
  id: string
}

export interface Level {
  id: number
  name: string
  objective: string
  targetScore: number
  moves: number
  obstacles: string[]
}

export interface GameState {
  currentLevel: Level
  board: GamePiece[][]
  score: number
  moves: number
  selectedPiece: { row: number; col: number } | null
  gameStatus: "playing" | "won" | "lost" | "paused"
  powerUps: {
    hammer: number
    shuffle: number
    extraMoves: number
    colorBomb: number
  }
}

interface GameContextType {
  gameState: GameState
  initializeLevel: (level: Level) => void
  makeMove: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void
  usePowerUp: (powerUp: keyof GameState["powerUps"], row?: number, col?: number) => void
  resetGame: () => void
  pauseGame: () => void
  resumeGame: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const LEVELS: Level[] = [
  {
    id: 1,
    name: "Toast Town Basics",
    objective: "Score 1000 points",
    targetScore: 1000,
    moves: 20,
    obstacles: [],
  },
  {
    id: 2,
    name: "Pancake Plains",
    objective: "Score 2000 points",
    targetScore: 2000,
    moves: 18,
    obstacles: ["jelly"],
  },
  {
    id: 3,
    name: "Butter Boulevard",
    objective: "Collect 10 butter pieces",
    targetScore: 1500,
    moves: 15,
    obstacles: ["chocolate"],
  },
  {
    id: 4,
    name: "Honey Hills",
    objective: "Score 3000 points",
    targetScore: 3000,
    moves: 16,
    obstacles: ["jelly", "chocolate"],
  },
  {
    id: 5,
    name: "Waffle Woods",
    objective: "Clear all obstacles",
    targetScore: 2500,
    moves: 14,
    obstacles: ["licorice", "chocolate", "jelly"],
  },
]

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: LEVELS[0],
    board: [],
    score: 0,
    moves: 0,
    selectedPiece: null,
    gameStatus: "playing",
    powerUps: {
      hammer: 3,
      shuffle: 2,
      extraMoves: 1,
      colorBomb: 1,
    },
  })

  const generateRandomPiece = (): GamePiece => {
    const types: PieceType[] = ["toast", "pancake", "honey", "butter", "waffle", "syrup"]
    const randomType = types[Math.floor(Math.random() * types.length)]
    return {
      type: randomType,
      special: "none",
      id: Math.random().toString(36).substr(2, 9),
    }
  }

  const initializeBoard = (): GamePiece[][] => {
    const board: GamePiece[][] = []
    for (let row = 0; row < 8; row++) {
      board[row] = []
      for (let col = 0; col < 8; col++) {
        board[row][col] = generateRandomPiece()
      }
    }
    return board
  }

  const findMatches = (board: GamePiece[][]): { row: number; col: number }[] => {
    const matches: { row: number; col: number }[] = []

    // Check horizontal matches
    for (let row = 0; row < 8; row++) {
      let count = 1
      let currentType = board[row][0].type

      for (let col = 1; col < 8; col++) {
        if (board[row][col].type === currentType && currentType !== "empty") {
          count++
        } else {
          if (count >= 3) {
            for (let i = col - count; i < col; i++) {
              matches.push({ row, col: i })
            }
          }
          count = 1
          currentType = board[row][col].type
        }
      }

      if (count >= 3) {
        for (let i = 8 - count; i < 8; i++) {
          matches.push({ row, col: i })
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < 8; col++) {
      let count = 1
      let currentType = board[0][col].type

      for (let row = 1; row < 8; row++) {
        if (board[row][col].type === currentType && currentType !== "empty") {
          count++
        } else {
          if (count >= 3) {
            for (let i = row - count; i < row; i++) {
              matches.push({ row: i, col })
            }
          }
          count = 1
          currentType = board[row][col].type
        }
      }

      if (count >= 3) {
        for (let i = 8 - count; i < 8; i++) {
          matches.push({ row: i, col })
        }
      }
    }

    return matches
  }

  const removeMatches = (board: GamePiece[][], matches: { row: number; col: number }[]): number => {
    let score = 0
    matches.forEach(({ row, col }) => {
      if (board[row][col].type !== "empty") {
        score += 50
        board[row][col] = { type: "empty", special: "none", id: "" }
      }
    })
    return score
  }

  const dropPieces = (board: GamePiece[][]) => {
    for (let col = 0; col < 8; col++) {
      let writeIndex = 7
      for (let row = 7; row >= 0; row--) {
        if (board[row][col].type !== "empty") {
          if (writeIndex !== row) {
            board[writeIndex][col] = board[row][col]
            board[row][col] = { type: "empty", special: "none", id: "" }
          }
          writeIndex--
        }
      }

      // Fill empty spaces with new pieces
      for (let row = writeIndex; row >= 0; row--) {
        board[row][col] = generateRandomPiece()
      }
    }
  }

  const initializeLevel = (level: Level) => {
    const board = initializeBoard()
    setGameState((prev) => ({
      ...prev,
      currentLevel: level,
      board,
      score: 0,
      moves: level.moves,
      selectedPiece: null,
      gameStatus: "playing",
    }))
  }

  const makeMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    if (gameState.gameStatus !== "playing" || gameState.moves <= 0) return

    const newBoard = gameState.board.map((row) => [...row])

    // Swap pieces
    const temp = newBoard[fromRow][fromCol]
    newBoard[fromRow][fromCol] = newBoard[toRow][toCol]
    newBoard[toRow][toCol] = temp

    // Check for matches
    const matches = findMatches(newBoard)

    if (matches.length === 0) {
      // No matches, revert swap
      return
    }

    let totalScore = gameState.score
    const currentBoard = newBoard

    // Process cascading matches
    while (true) {
      const currentMatches = findMatches(currentBoard)
      if (currentMatches.length === 0) break

      totalScore += removeMatches(currentBoard, currentMatches)
      dropPieces(currentBoard)
    }

    const newMoves = gameState.moves - 1
  let newStatus: GameState["gameStatus"] = gameState.gameStatus

    // Check win/lose conditions
    if (totalScore >= gameState.currentLevel.targetScore) {
      newStatus = "won"
    } else if (newMoves <= 0) {
      newStatus = "lost"
    }

    setGameState((prev) => ({
      ...prev,
      board: currentBoard,
      score: totalScore,
      moves: newMoves,
      selectedPiece: null,
      gameStatus: newStatus,
    }))
  }

  const usePowerUp = (powerUp: keyof GameState["powerUps"], row?: number, col?: number) => {
    if (gameState.powerUps[powerUp] <= 0) return

    const newBoard = gameState.board.map((row) => [...row])
    let scoreBonus = 0

    switch (powerUp) {
      case "hammer":
        if (row !== undefined && col !== undefined) {
          newBoard[row][col] = { type: "empty", special: "none", id: "" }
          scoreBonus = 100
        }
        break
      case "shuffle":
        // Shuffle the board
        const pieces: GamePiece[] = []
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (newBoard[r][c].type !== "empty") {
              pieces.push(newBoard[r][c])
            }
          }
        }

        // Fisher-Yates shuffle
        for (let i = pieces.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[pieces[i], pieces[j]] = [pieces[j], pieces[i]]
        }

        let pieceIndex = 0
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (newBoard[r][c].type !== "empty") {
              newBoard[r][c] = pieces[pieceIndex++]
            }
          }
        }
        break
      case "extraMoves":
        setGameState((prev) => ({
          ...prev,
          moves: prev.moves + 5,
          powerUps: { ...prev.powerUps, [powerUp]: prev.powerUps[powerUp] - 1 },
        }))
        return
      case "colorBomb":
        if (row !== undefined && col !== undefined) {
          const targetType = newBoard[row][col].type
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              if (newBoard[r][c].type === targetType) {
                newBoard[r][c] = { type: "empty", special: "none", id: "" }
                scoreBonus += 50
              }
            }
          }
        }
        break
    }

    dropPieces(newBoard)

    setGameState((prev) => ({
      ...prev,
      board: newBoard,
      score: prev.score + scoreBonus,
      powerUps: { ...prev.powerUps, [powerUp]: prev.powerUps[powerUp] - 1 },
    }))
  }

  const resetGame = () => {
    initializeLevel(gameState.currentLevel)
  }

  const pauseGame = () => {
    setGameState((prev) => ({ ...prev, gameStatus: "paused" }))
  }

  const resumeGame = () => {
    setGameState((prev) => ({ ...prev, gameStatus: "playing" }))
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        initializeLevel,
        makeMove,
        usePowerUp,
        resetGame,
        pauseGame,
        resumeGame,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within GameProvider")
  }
  return context
}

export { LEVELS }
