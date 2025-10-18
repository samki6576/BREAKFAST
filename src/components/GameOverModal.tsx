import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

interface GameOverModalProps {
  visible: boolean
  onRetry: () => void
  onMenu: () => void
  canRetry: boolean
  livesRemaining: number
}

export default function GameOverModal({ visible, onRetry, onMenu, canRetry, livesRemaining }: GameOverModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient colors={["#fef3c7", "#fde68a"]} style={styles.modalContainer}>
          <Text style={styles.sadEmoji}>😔</Text>
          <Text style={styles.title}>Game Over</Text>
          <Text style={styles.subtitle}>Don't give up! Try again to beat this level.</Text>

          <View style={styles.livesContainer}>
            <Text style={styles.livesText}>❤️ Lives Remaining: {livesRemaining}</Text>
            {!canRetry && (
              <Text style={styles.livesInfo}>Lives refill every 30 minutes or visit the shop to buy more!</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onMenu} activeOpacity={0.8}>
              <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>🏠 Menu</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, !canRetry && styles.disabledButton]}
              onPress={onRetry}
              disabled={!canRetry}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={canRetry ? ["#f59e0b", "#d97706"] : ["#d1d5db", "#9ca3af"]}
                style={styles.buttonGradient}
              >
                <Text style={[styles.buttonText, !canRetry && styles.disabledText]}>🔄 Retry</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 30,
    borderWidth: 4,
    borderColor: "#fbbf24",
    alignItems: "center",
  },
  sadEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#b45309",
    textAlign: "center",
    marginBottom: 20,
  },
  livesContainer: {
    backgroundColor: "#fef3c7",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    marginBottom: 25,
    alignItems: "center",
  },
  livesText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 10,
  },
  livesInfo: {
    fontSize: 12,
    color: "#b45309",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
  },
  button: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#6b7280",
  },
})
