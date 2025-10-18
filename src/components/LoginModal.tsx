"use client"

import { useState } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useUser } from "../contexts/UserContext"

interface LoginModalProps {
  visible: boolean
  onClose: () => void
}

export default function LoginModal({ visible, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const { signIn } = useUser()

  const handleSubmit = () => {
    if (username.trim() && email.trim()) {
      signIn(username.trim(), email.trim())
      onClose()
      setUsername("")
      setEmail("")
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
          <LinearGradient colors={["#fef3c7", "#fde68a"]} style={styles.modalContainer}>
            <Text style={styles.title}>Welcome to Breakfast Blitz!</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>👤 Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor="#b45309"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>📧 Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#b45309"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
              <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.buttonGradient}>
                <Text style={styles.submitText}>Start Playing!</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.bonusInfo}>
              <Text style={styles.bonusText}>
                🎁 <Text style={styles.bonusBold}>Welcome Bonus:</Text> Get 100 coins and 5 lives to start your
                breakfast adventure!
              </Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </LinearGradient>
        </KeyboardAvoidingView>
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
  keyboardView: {
    width: "90%",
    maxWidth: 400,
  },
  modalContainer: {
    borderRadius: 20,
    padding: 25,
    borderWidth: 4,
    borderColor: "#fbbf24",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#92400e",
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: "#fbbf24",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "white",
    color: "#92400e",
  },
  submitButton: {
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  submitText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
  },
  bonusInfo: {
    backgroundColor: "#fef3c7",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#fbbf24",
  },
  bonusText: {
    fontSize: 14,
    color: "#b45309",
    textAlign: "center",
  },
  bonusBold: {
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(146, 64, 14, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 18,
    color: "#92400e",
    fontWeight: "bold",
  },
})
