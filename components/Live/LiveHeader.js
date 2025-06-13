import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

export default function LiveHeader({
  onClose,
  stallNo,
  stallLocation,
  stallSize,
  rentalPrice,
  isLive,
  onToggleLive,
  raffleStatus,
  timerRunning,
}) {
  const handleToggleLive = () => {
    onToggleLive();
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.stallTitle}>Stall {stallNo}</Text>
          <View style={styles.stallDetails}>
            <Text style={styles.stallDetailText}>
              📍 {stallLocation} • {stallSize} • ₱{rentalPrice}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status: </Text>
            <Text
              style={[
                styles.statusText,
                { color: timerRunning ? "#10B981" : "#F59E0B" },
              ]}
            >
              {raffleStatus}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity
          style={[
            styles.liveButton,
            { backgroundColor: isLive ? "#DC2626" : "#10B981" },
          ]}
          onPress={handleToggleLive}
        >
          <Text style={styles.liveButtonText}>
            {isLive ? "Stop Live" : "Start Live"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151",
  },
  headerInfo: {
    flex: 1,
  },
  stallTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  stallDetails: {
    marginTop: 2,
  },
  stallDetailText: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  liveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  liveButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});