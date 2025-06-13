import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const CountdownTimer = ({ endTime, isRunning, onTimerEnd }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    console.log("CountdownTimer props:", {
      endTime,
      isRunning,
      endTimeType: typeof endTime,
      endTimeDate: endTime ? new Date(endTime).toISOString() : "null",
      currentTime: Date.now(),
      currentTimeDate: new Date().toISOString(),
      difference: endTime ? endTime - Date.now() : "N/A",
    });

    if (!endTime || !isRunning || endTime === null || endTime === "null") {
      console.log(
        "Timer not running - endTime:",
        endTime,
        "isRunning:",
        isRunning
      );
      setTimeLeft(null);
      setIsExpired(false);
      return;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      let targetTime = endTime;

      if (typeof endTime === "string") {
        if (endTime === "null" || endTime === "") {
          console.log("Invalid endTime string:", endTime);
          return;
        }
        targetTime = new Date(endTime).getTime();
      } else if (typeof endTime === "number") {
        if (endTime < 10000000000) {
          targetTime = endTime * 1000;
        } else {
          targetTime = endTime;
        }
      }

      if (isNaN(targetTime) || targetTime <= 0) {
        console.log("Invalid targetTime:", targetTime);
        return;
      }

      const difference = targetTime - now;

      console.log("Timer calculation:", {
        now,
        targetTime,
        difference,
        isPositive: difference > 0,
      });

      if (difference <= 0) {
        console.log("Timer expired!");
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
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const newTimeLeft = { days, hours, minutes, seconds };
      console.log("New time left:", newTimeLeft);
      setTimeLeft(newTimeLeft);
      setIsExpired(false);
    };

    calculateTimeLeft();

    const interval = setInterval(calculateTimeLeft, 1000);

    return () => {
      console.log("Cleaning up timer interval");
      clearInterval(interval);
    };
  }, [endTime, isRunning, onTimerEnd]);

  if (!isRunning) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>Timer not started</Text>
      </View>
    );
  }

  if (isExpired) {
    return (
      <View style={styles.container}>
        <Text style={[styles.statusText, styles.expiredText]}>
          🎯 Raffle Time!
        </Text>
      </View>
    );
  }

  if (!timeLeft) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>Calculating...</Text>
        {/* Add debug info in development */}
        {__DEV__ && (
          <Text style={styles.debugText}>
            Debug: endTime={String(endTime)}, isRunning={String(isRunning)}
          </Text>
        )}
      </View>
    );
  }

  const formatNumber = (num) => num.toString().padStart(2, "0");

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Time Until Raffle:</Text>
      <View style={styles.timerContainer}>
        {timeLeft.days > 0 && (
          <>
            <View style={styles.timeUnit}>
              <Text style={styles.timeValue}>{timeLeft.days}</Text>
              <Text style={styles.timeLabel}>
                Day{timeLeft.days !== 1 ? "s" : ""}
              </Text>
            </View>
            <Text style={styles.separator}>:</Text>
          </>
        )}

        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{formatNumber(timeLeft.hours)}</Text>
          <Text style={styles.timeLabel}>Hr</Text>
        </View>

        <Text style={styles.separator}>:</Text>

        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{formatNumber(timeLeft.minutes)}</Text>
          <Text style={styles.timeLabel}>Min</Text>
        </View>

        <Text style={styles.separator}>:</Text>

        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{formatNumber(timeLeft.seconds)}</Text>
          <Text style={styles.timeLabel}>Sec</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    minWidth: 200,
  },
  label: {
    fontSize: 13,
    color: "#495057",
    marginBottom: 8,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timeUnit: {
    alignItems: "center",
    minWidth: 40,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
    fontFamily: "monospace",
  },
  timeLabel: {
    fontSize: 10,
    color: "#6c757d",
    marginTop: 2,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  separator: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
    marginHorizontal: 6,
    fontFamily: "monospace",
  },
  statusText: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "600",
  },
  expiredText: {
    color: "#28a745",
    fontSize: 16,
    fontWeight: "700",
  },
  debugText: {
    fontSize: 10,
    color: "#999",
    marginTop: 5,
  },
});

export default CountdownTimer;
