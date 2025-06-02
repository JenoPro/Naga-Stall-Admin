import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import styles from "../../../Styles/ManageStall";
import CompactCountdownTimer from "./CompactCountdownTimer";

export default function CountdownSection({
  item,
  timerRunning,
  timerPaused,
  onStartTimer,
  onStopTimer,
  onResetTimer,
  onTimerEnd,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTimeFromTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <View style={[styles.tableCell, styles.dateCell]}>
      <View style={compactStyles.compactCountdownSection}>
        {!timerRunning || !item.end_time ? (
          <>
            <Text style={compactStyles.compactRaffleLabel}>
              No Raffle Set
            </Text>
            <TouchableOpacity
              style={[
                compactStyles.compactTimerButton,
                compactStyles.startButton,
              ]}
              onPress={onStartTimer}
            >
              <Text style={compactStyles.compactTimerButtonText}>
                Start
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={compactStyles.compactRaffleLabel}>
              {formatDate(item.raffleDate)}
            </Text>
            <Text style={compactStyles.compactTimeLabel}>
              {formatTimeFromTimestamp(item.end_time)}
            </Text>

            <CompactCountdownTimer
              endTime={item.end_time}
              isRunning={timerRunning && !timerPaused}
              onTimerEnd={onTimerEnd}
              isPaused={timerPaused}
              key={`timer-${item.stallId}-${item.end_time}-${timerRunning}-${timerPaused}`}
            />

            <View style={compactStyles.buttonContainer}>
              <TouchableOpacity
                style={[
                  compactStyles.compactTimerButton,
                  timerPaused
                    ? compactStyles.resumeButton
                    : compactStyles.pauseButton,
                ]}
                onPress={onStopTimer}
              >
                <Text style={compactStyles.compactTimerButtonText}>
                  {timerPaused ? "Resume" : "Pause"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  compactStyles.compactTimerButton,
                  compactStyles.resetButton,
                ]}
                onPress={onResetTimer}
              >
                <Text style={compactStyles.compactTimerButtonText}>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const compactStyles = StyleSheet.create({
  compactCountdownSection: {
    alignItems: "center",
    width: 150,
    padding: 6,
    justifyContent: "center",
  },
  compactRaffleLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
    textAlign: "center",
    fontWeight: "500",
  },
  compactTimeLabel: {
    fontSize: 9,
    color: "#888",
    marginBottom: 4,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    gap: 4,
  },
  compactTimerButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    flex: 1,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  pauseButton: {
    backgroundColor: "#FF9800",
  },
  resumeButton: {
    backgroundColor: "#2196F3",
  },
  resetButton: {
    backgroundColor: "#F44336",
  },
  compactTimerButtonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
});