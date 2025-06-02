import { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  setRaffleTimeAndStart,
  clearStallTimer,
  completeRaffleTimer,
} from "../ViewParticipants/AddComponents/StallService";

export default function useStallTimer(item, onStallUpdated, setShowRaffleTimeModal) {
  const [timerRunning, setTimerRunning] = useState(item.time_running || false);
  const [timerPaused, setTimerPaused] = useState(false);

  // Sync timer state with item changes
  useEffect(() => {
    setTimerRunning(item.time_running || false);
    if (!item.time_running) {
      setTimerPaused(false);
    }
  }, [item.time_running, item.end_time, item.status]);

  const handleStartTimer = () => {
    setShowRaffleTimeModal(true);
  };

  const handleStopTimer = async () => {
    if (!timerPaused) {
      setTimerPaused(true);
      Alert.alert("Timer Paused", "The raffle timer has been paused.");
    } else {
      setTimerPaused(false);
      Alert.alert("Timer Resumed", "The raffle timer has been resumed.");
    }
  };

  const handleResetTimer = async () => {
    Alert.alert(
      "Reset Timer",
      "Are you sure you want to reset the timer? This will clear all timer data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await clearStallTimer(item.stallId);
              if (success) {
                setTimerRunning(false);
                setTimerPaused(false);

                const updatedItem = {
                  ...item,
                  status: "available",
                  time_running: false,
                  end_time: null,
                  raffleDate: null,
                };

                if (onStallUpdated) {
                  onStallUpdated(updatedItem);
                }

                Alert.alert("Timer Reset", "The raffle timer has been reset.");
              } else {
                Alert.alert("Error", "Failed to reset timer");
              }
            } catch (error) {
              console.error("Error resetting timer:", error);
              Alert.alert("Error", "An error occurred while resetting the timer");
            }
          },
        },
      ]
    );
  };

  const handleStartTimerWithTime = async (dateTime, time) => {
    setShowRaffleTimeModal(false);

    try {
      const success = await setRaffleTimeAndStart(item.stallId, dateTime, time);

      if (success) {
        const endTimeMilliseconds = dateTime.getTime();
        setTimerRunning(true);
        setTimerPaused(false);

        const updatedItem = {
          ...item,
          status: "Countdown",
          time_running: true,
          end_time: endTimeMilliseconds,
          raffleDate: dateTime.toISOString().split("T")[0],
        };

        if (onStallUpdated) {
          onStallUpdated(updatedItem);
        }
      }
    } catch (error) {
      console.error("Error starting timer:", error);
      Alert.alert("Error", "Failed to start timer");
    }
  };

  const handleTimerEnd = async () => {
    try {
      await completeRaffleTimer(item.stallId);
      setTimerRunning(false);
      setTimerPaused(false);

      const updatedItem = {
        ...item,
        status: "Raffle",
        time_running: false,
      };

      if (onStallUpdated) {
        onStallUpdated(updatedItem);
      }

      Alert.alert(
        "Raffle Time!",
        `The raffle for Stall ${item.stallNo} is ready to begin!`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error completing raffle timer:", error);
    }
  };

  return {
    timerRunning,
    timerPaused,
    handleStartTimer,
    handleStopTimer,
    handleResetTimer,
    handleStartTimerWithTime,
    handleTimerEnd,
  };
}