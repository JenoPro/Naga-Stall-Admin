import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CompactCountdownTimer({
  endTime,
  isRunning,
  onTimerEnd,
  isPaused,
}) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!endTime || !isRunning || endTime === null || endTime === "null") {
      setTimeLeft(null);
      setIsExpired(false);
      return;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      let targetTime = endTime;

      if (typeof endTime === "string") {
        if (endTime === "null" || endTime === "") return;
        targetTime = new Date(endTime).getTime();
      } else if (typeof endTime === "number") {
        if (endTime < 10000000000) {
          targetTime = endTime * 1000;
        } else {
          targetTime = endTime;
        }
      }

      if (isNaN(targetTime) || targetTime <= 0) return;

      const difference = targetTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft(null);
        if (onTimerEnd && typeof onTimerEnd === "function") {
          onTimerEnd();
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      setIsExpired(false);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [endTime, isRunning, onTimerEnd]);

  if (!isRunning && isPaused) {
    return (
      <Text style={[timerStyles.compactStatusText, timerStyles.pausedText]}>
        ⏸️ Paused
      </Text>
    );
  }

  if (!isRunning) {
    return (
      <Text style={timerStyles.compactStatusText}>Not Started</Text>
    );
  }

  if (isExpired) {
    return (
      <Text style={[timerStyles.compactStatusText, timerStyles.expiredText]}>
        🎯 Ready!
      </Text>
    );
  }

  if (!timeLeft) {
    return (
      <Text style={timerStyles.compactStatusText}>Loading...</Text>
    );
  }

  const formatNumber = (num) => num.toString().padStart(2, "0");

  return (
    <View style={timerStyles.compactTimerContainer}>
      {timeLeft.days > 0 && (
        <View style={timerStyles.timeRow}>
          <Text style={timerStyles.compactTimeValue}>{timeLeft.days}</Text>
          <Text style={timerStyles.compactTimeLabel}>d</Text>
        </View>
      )}
      <View style={timerStyles.timeRow}>
        <Text style={timerStyles.compactTimeValue}>
          {formatNumber(timeLeft.hours)}
        </Text>
        <Text style={timerStyles.compactTimeLabel}>h</Text>
      </View>
      <Text style={timerStyles.separator}>:</Text>
      <View style={timerStyles.timeRow}>
        <Text style={timerStyles.compactTimeValue}>
          {formatNumber(timeLeft.minutes)}
        </Text>
        <Text style={timerStyles.compactTimeLabel}>m</Text>
      </View>
      <Text style={timerStyles.separator}>:</Text>
      <View style={timerStyles.timeRow}>
        <Text style={timerStyles.compactTimeValue}>
          {formatNumber(timeLeft.seconds)}
        </Text>
        <Text style={timerStyles.compactTimeLabel}>s</Text>
      </View>
    </View>
  );
}

const timerStyles = StyleSheet.create({
  compactTimerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginVertical: 3,
    borderWidth: 1,
    borderColor: "#e9ecef",
    flexWrap: "nowrap",
  },
  timeRow: {
    alignItems: "center",
    minWidth: 20,
  },
  compactTimeValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563eb",
    fontFamily: "monospace",
    textAlign: "center",
  },
  compactTimeLabel: {
    fontSize: 8,
    color: "#6c757d",
    fontWeight: "500",
    textAlign: "center",
  },
  separator: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563eb",
    marginHorizontal: 3,
    fontFamily: "monospace",
  },
  compactStatusText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: "#f8f9fa",
    color: "#6c757d",
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginVertical: 3,
  },
  pausedText: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    borderColor: "#ffeaa7",
  },
  expiredText: {
    backgroundColor: "#d4edda",
    color: "#155724",
    borderColor: "#c3e6cb",
    fontWeight: "700",
  },
});