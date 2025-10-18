"use client"

import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react"

interface AccessibilitySettingsProps {
  onClose: () => void
}

export default function AccessibilitySettings({ onClose }: AccessibilitySettingsProps) {
  const [colorblindMode, setColorblindMode] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [largerText, setLargerText] = useState(false)

  return (
    <LinearGradient colors={["#fef3c7", "#fde68a"]} style={styles.container}>
      <Text style={styles.title}>♿ Accessibility Settings</Text>

      <View style={styles.settingsList}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>🎨 Colorblind Support</Text>
            <Text style={styles.settingDesc}>Use shapes instead of colors</Text>
          </View>
          <Switch
            value={colorblindMode}
            onValueChange={setColorblindMode}
            trackColor={{ false: "#fbbf24", true: "#f59e0b" }}
            thumbColor={colorblindMode ? "#92400e" : "#b45309"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>🔆 High Contrast</Text>
            <Text style={styles.settingDesc}>Enhanced visual clarity</Text>
          </View>
          <Switch
            value={highContrast}
            onValueChange={setHighContrast}
            trackColor={{ false: "#fbbf24", true: "#f59e0b" }}
            thumbColor={highContrast ? "#92400e" : "#b45309"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>🐌 Reduced Motion</Text>
            <Text style={styles.settingDesc}>Minimize animations</Text>
          </View>
          <Switch
            value={reducedMotion}
            onValueChange={setReducedMotion}
            trackColor={{ false: "#fbbf24", true: "#f59e0b" }}
            thumbColor={reducedMotion ? "#92400e" : "#b45309"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>🔤 Larger Text</Text>
            <Text style={styles.settingDesc}>Increase font sizes</Text>
          </View>
          <Switch
            value={largerText}
            onValueChange={setLargerText}
            trackColor={{ false: "#fbbf24", true: "#f59e0b" }}
            thumbColor={largerText ? "#92400e" : "#b45309"}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={onClose} activeOpacity={0.8}>
        <LinearGradient colors={["#fbbf24", "#f59e0b"]} style={styles.buttonGradient}>
          <Text style={styles.saveText}>Save Accessibility Settings</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#92400e",
    textAlign: "center",
    marginBottom: 30,
  },
  settingsList: {
    flex: 1,
    gap: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.3)",
    padding: 20,
    borderRadius: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 5,
  },
  settingDesc: {
    fontSize: 14,
    color: "#b45309",
  },
  saveButton: {
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 20,
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
