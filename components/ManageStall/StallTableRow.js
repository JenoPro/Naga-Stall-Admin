import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "../../Styles/ManageStall";
import ViewParticipantsModal from "./ViewParticipants/ViewParticipantsModal";
import EditStallModal from "./EditDelete/EditStallModal";
import DeleteConfirmationModal from "./EditDelete/DeleteConfirmationModal";
import RaffleTimeModal from "./ViewParticipants/TimerComponents/RaffleTimeModal";
import {
  deleteStallData,
  setRaffleTimeAndStart,
  clearStallTimer,
  completeRaffleTimer,
} from "./ViewParticipants/AddComponents/StallService";

// Import new components
import StallImage from "./TableComponents/StallImage";
import StallBasicInfo from "./TableComponents/StallBasicInfo";
import CountdownSection from "./TableComponents/CountdownSection";
import ParticipantsButton from "./TableComponents/ParticipantsButton";
import ActionButtons from "./TableComponents/ActionButtons";

export default function StallTableRow({
  item,
  getImageUrl,
  onViewImage,
  onEditStall,
  onRemoveStall,
  onGoLive,
  onStallUpdated,
  onStallDeleted,
  fetchParticipants,
  participantsData,
}) {
  // Modal states
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRaffleTimeModal, setShowRaffleTimeModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Participants state
  const [participants, setParticipants] = useState([]);
  const [lastViewedCount, setLastViewedCount] = useState(0);
  const [newParticipantsCount, setNewParticipantsCount] = useState(0);

  // Timer states
  const [timerRunning, setTimerRunning] = useState(item.time_running || false);
  const [timerPaused, setTimerPaused] = useState(false);

  // Sync timer state with item changes
  useEffect(() => {
    setTimerRunning(item.time_running || false);
    if (!item.time_running) {
      setTimerPaused(false);
    }
  }, [item.time_running, item.end_time, item.status]);

  // Load participants data
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        let participantList = [];
        if (fetchParticipants && typeof fetchParticipants === "function") {
          participantList = await fetchParticipants(item.stallId);
        } else if (participantsData && participantsData[item.stallId]) {
          participantList = participantsData[item.stallId];
        }

        setParticipants(participantList);

        const savedViewedCount = await loadViewedCount(item.stallId);
        setLastViewedCount(savedViewedCount);

        const currentCount = participantList.length;
        const newCount = Math.max(0, currentCount - savedViewedCount);
        setNewParticipantsCount(newCount);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    loadParticipants();
  }, [item.stallId, participantsData, fetchParticipants]);

  // AsyncStorage helpers
  const getViewedCountKey = (stallId) => `stall_${stallId}_viewed_count`;

  const loadViewedCount = async (stallId) => {
    try {
      const key = getViewedCountKey(stallId);
      const value = await AsyncStorage.getItem(key);
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error("Error loading viewed count:", error);
      return 0;
    }
  };

  const saveViewedCount = async (stallId, count) => {
    try {
      const key = getViewedCountKey(stallId);
      await AsyncStorage.setItem(key, count.toString());
    } catch (error) {
      console.error("Error saving viewed count:", error);
    }
  };

  // Timer handlers
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

  // Modal handlers
  const handleViewParticipants = () => {
    setShowParticipantsModal(true);
  };

  const handleCloseParticipantsModal = async () => {
    setShowParticipantsModal(false);
    const currentParticipantCount = participants.length;
    setLastViewedCount(currentParticipantCount);
    setNewParticipantsCount(0);
    await saveViewedCount(item.stallId, currentParticipantCount);
  };

  const handleEditStall = () => {
    setShowEditModal(true);
    if (onEditStall && typeof onEditStall === "function") {
      onEditStall(item.stallId);
    }
  };

  const handleRemoveStall = () => {
    setShowDeleteModal(true);
    if (onRemoveStall && typeof onRemoveStall === "function") {
      onRemoveStall(item.stallId);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteStallData(item.stallId);
      if (success) {
        setShowDeleteModal(false);
        if (onStallDeleted && typeof onStallDeleted === "function") {
          onStallDeleted(item.stallId);
        }
        Alert.alert("Success", "Stall has been deleted successfully");
      } else {
        Alert.alert("Error", "Failed to delete stall");
      }
    } catch (error) {
      console.error("Error deleting stall:", error);
      Alert.alert("Error", "An error occurred while deleting the stall");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStallUpdated = (updatedStallData) => {
    setShowEditModal(false);
    if (onStallUpdated && typeof onStallUpdated === "function") {
      onStallUpdated(updatedStallData);
    }
  };

  return (
    <>
      <View style={styles.tableRow}>
        <StallImage
          stallImage={item.stallImage}
          getImageUrl={getImageUrl}
          onViewImage={onViewImage}
        />
        
        <StallBasicInfo
          stallNo={item.stallNo}
          stallLocation={item.stallLocation}
          size={item.size}
          rentalPrice={item.rentalPrice}
        />

        <CountdownSection
          item={item}
          timerRunning={timerRunning}
          timerPaused={timerPaused}
          onStartTimer={handleStartTimer}
          onStopTimer={handleStopTimer}
          onResetTimer={handleResetTimer}
          onTimerEnd={handleTimerEnd}
        />

        <ParticipantsButton
          participants={participants}
          newParticipantsCount={newParticipantsCount}
          onViewParticipants={handleViewParticipants}
        />

        <ActionButtons
          status={item.status}
          onEdit={handleEditStall}
          onRemove={handleRemoveStall}
          onGoLive={() => onGoLive && onGoLive(item.stallId)}
        />
      </View>

      {/* Modals */}
      <ViewParticipantsModal
        visible={showParticipantsModal}
        onClose={handleCloseParticipantsModal}
        stallId={item.stallId}
        stallNo={item.stallNo}
        participants={participants}
      />

      <EditStallModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onStallUpdated={handleStallUpdated}
        stallData={item}
      />

      <DeleteConfirmationModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        stallNo={item.stallNo}
        isDeleting={isDeleting}
      />

      <RaffleTimeModal
        visible={showRaffleTimeModal}
        onClose={() => setShowRaffleTimeModal(false)}
        onConfirm={handleStartTimerWithTime}
        stallNo={item.stallNo}
      />
    </>
  );
}