"use client"

import { useState } from "react"
import { Modal, View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Slider from "@react-native-community/slider"
import { useSoundManager } from "../utils/SoundManager"

interface SettingsModalProps {
  visible: boolean
  onClose: () => void
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const {
    isReady,
    soundEnabled,
    musicEnabled,
    soundVolume,
    musicVolume,
    toggleSound,
    toggleMusic,
    setSoundVolume,
    setMusicVolume,
    playSound,
  } = useSoundManager()

  const [vibration, setVibration] = useState(true)
  const [showAccessibility, setShowAccessibility] = useState(false)

  // Play sound effect when slider changes
  const handleSoundVolumeChange = (value: number) => {
    setSoundVolume(value)
    if (soundEnabled && value > 0) {
      playSound("button_click")
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <LinearGradient colors={["#fef3c7", "#fde68a"]} style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingIcon}>🔊</Text>
              <Text style={styles.settingLabel}>Sound Effects</Text>
            </View>
            <View style={styles.controlsRow}>
              <Switch
                value={soundEnabled}
                onValueChange={toggleSound}
                trackColor={{ false: "#fbbf24", true: "#f59e0b" }}
                thumbColor={soundEnabled ? "#92400e" : "#b45309"}
              />
              <Slider
                style={[styles.slider, !soundEnabled && styles.disabledSlider]}
                minimumValue={0}
                maximumValue={1}
                value={soundVolume}
                onValueChange={handleSoundVolumeChange}
                minimumTrackTintColor="#f59e0b"
                maximumTrackTintColor="#fbbf24"
                disabled={!soundEnabled}
              />
              <Text style={styles.volumeText}>{Math.round(soundVolume * 100)}%</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingIcon}>🎵</Text>
              <Text style={styles.settingLabel}>Music</Text>
            </View>
            <View style={styles.controlsRow}>
              <Switch
                value={musicEnabled}
                onValueChange={toggleMusic}
                trackColor={{ false: "#fbbf24", true: "#f59e0b" }}
                thumbColor={musicEnabled ? "#92400e" : "#b45309"}
              />
              <Slider
                style={[styles.slider, !musicEnabled && styles.disabledSlider]}
                minimumValue={0}
                maximumValue={1}
                value={musicVolume}
                onValueChange={setMusicVolume}
                minimumTrackTintColor="#f59e0b"
                maximumTrackTintColor="#fbbf24"
                disabled={!musicEnabled}
              />
              <Text style={styles.volumeText}>{Math.round(musicVolume * 100)}%</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingIcon}>📳</Text>
              <Text style={styles.settingLabel}>Vibration</Text>
            </View>
            <Switch
              value={vibration}
              onValueChange={setVibration}
              trackColor={{ false: "#fbbf24", true: "#f59e0b" }}
              thumbColor={vibration ? "#92400e" : "#b45309"}
            />
          </View>

          <TouchableOpacity
            style={styles.accessibilityButton}
            onPress={() => {
              playSound("button_click")
              setShowAccessibility(!showAccessibility)
            }}
          >
            <Text style={styles.accessibilityText}>♿ Accessibility Settings</Text>
          </TouchableOpacity>

          {showAccessibility && (
            <View style={styles.accessibilityContainer}>
              <View style={styles.accessibilityItem}>
                <Text style={styles.accessibilityLabel}>🎨 Colorblind Mode</Text>
                <Switch
                  value={false}
                  onValueChange={() => {}}
                  trackColor={{ false: "#fbbf24", true: "#f59e0b" }}
                  thumbColor={"#b45309"}
                />
              </View>

              <View style={styles.accessibilityItem}>
                <Text style={styles.accessibilityLabel}>🔆 High Contrast</Text>
                <Switch
                  value={false}
                  onValueChange={() => {}}
                  trackColor={{ false: "#fbbf24", true: "#f59e0b" }}
                  thumbColor={"#b45309"}
                />
              </View>

              <View style={styles.accessibilityItem}>
                <Text style={styles.accessibilityLabel}>🐌 Reduced Motion</Text>
                <Switch
                  value={false}
                  onValueChange={() => {}}
                  trackColor={{ false: "#fbbf24", true: "#f59e0b" }}
                  thumbColor={"#b45309"}
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              playSound("button_click")
              onClose()
            }}
            activeOpacity={0.8}
          >
            <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.buttonGradient}>
              <Text style={styles.saveText}>Save Settings</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    padding: 25,
    borderWidth: 4,
    borderColor: "#fbbf24",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#92400e",
  },
  closeButton: {
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
  settingItem: {
    marginBottom: 25,
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
    flex: 1,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  disabledSlider: {
    opacity: 0.5,
  },
  volumeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
    minWidth: 40,
    textAlign: "right",
  },
  accessibilityButton: {
    backgroundColor: "rgba(251, 191, 36, 0.3)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  accessibilityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400e",
    textAlign: "center",
  },
  accessibilityContainer: {
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  accessibilityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  accessibilityLabel: {
    fontSize: 16,
    color: "#92400e",
  },
  saveButton: {
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 10,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  saveText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
  },
})
