import React, { useState } from "react";
import { View, Alert } from "react-native";

import styles from "../../Styles/ManageStall";
import { deleteStallData } from "./ViewParticipants/AddComponents/StallService";

import StallImage from "./TableComponents/StallImage";
import StallBasicInfo from "./TableComponents/StallBasicInfo";
import CountdownSection from "./TableComponents/CountdownSection";
import ParticipantsButton from "./TableComponents/ParticipantsButton";
import ActionButtons from "./TableComponents/ActionButtons";
import StallModals from "./StallModal/StallModals";
import LiveRaffle from "../../screen/LiveRaffle";
import useStallTimer from "./StallModal/useStallTimer";
import useStallParticipants from "./StallModal/useStallParticipants";

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
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRaffleTimeModal, setShowRaffleTimeModal] = useState(false);
  const [showLiveRaffle, setShowLiveRaffle] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    timerRunning,
    timerPaused,
    handleStartTimer: startTimer,
    handleStopTimer: stopTimer,
    handleResetTimer: resetTimer,
    handleStartTimerWithTime,
    handleTimerEnd,
  } = useStallTimer(item, onStallUpdated, setShowRaffleTimeModal);

  const {
    participants,
    newParticipantsCount,
    handleViewParticipants,
    handleCloseParticipantsModal,
  } = useStallParticipants(
    item,
    fetchParticipants,
    participantsData,
    setShowParticipantsModal
  );

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

  const handleGoLive = () => {
    setShowLiveRaffle(true);

    if (onGoLive && typeof onGoLive === "function") {
      onGoLive(item.stallId);
    }
  };

  const handleCloseLiveRaffle = () => {
    setShowLiveRaffle(false);
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
          onStartTimer={startTimer}
          onStopTimer={stopTimer}
          onResetTimer={resetTimer}
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
          onGoLive={handleGoLive}
        />
      </View>

      <StallModals
        showParticipantsModal={showParticipantsModal}
        onCloseParticipantsModal={handleCloseParticipantsModal}
        stallId={item.stallId}
        stallNo={item.stallNo}
        participants={participants}
        showEditModal={showEditModal}
        onCloseEditModal={() => setShowEditModal(false)}
        onStallUpdated={handleStallUpdated}
        stallData={item}
        showDeleteModal={showDeleteModal}
        onCloseDeleteModal={() => setShowDeleteModal(false)}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
        showRaffleTimeModal={showRaffleTimeModal}
        onCloseRaffleTimeModal={() => setShowRaffleTimeModal(false)}
        onConfirmRaffleTime={handleStartTimerWithTime}
      />

      {/* Live Raffle Modal */}
      <LiveRaffle
        visible={showLiveRaffle}
        onClose={handleCloseLiveRaffle}
        stallData={item}
        stallNo={item.stallNo}
        stallLocation={item.stallLocation}
        stallSize={item.size}
        rentalPrice={item.rentalPrice}
        stallImage={item.stallImage}
        getImageUrl={getImageUrl}
        participants={participants}
        timerRunning={timerRunning}
        timerPaused={timerPaused}
      />
    </>
  );
}
