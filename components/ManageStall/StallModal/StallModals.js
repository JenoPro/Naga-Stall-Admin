import React from "react";
import ViewParticipantsModal from "../ViewParticipants/ViewParticipantsModal";
import EditStallModal from "../EditDelete/EditStallModal";
import DeleteConfirmationModal from "../EditDelete/DeleteConfirmationModal";
import RaffleTimeModal from "../ViewParticipants/TimerComponents/RaffleTimeModal";

export default function StallModals({
  // Participants Modal props
  showParticipantsModal,
  onCloseParticipantsModal,
  stallId,
  stallNo,
  participants,
  
  // Edit Modal props
  showEditModal,
  onCloseEditModal,
  onStallUpdated,
  stallData,
  
  // Delete Modal props
  showDeleteModal,
  onCloseDeleteModal,
  onConfirmDelete,
  isDeleting,
  
  // Raffle Time Modal props
  showRaffleTimeModal,
  onCloseRaffleTimeModal,
  onConfirmRaffleTime,
}) {
  return (
    <>
      <ViewParticipantsModal
        visible={showParticipantsModal}
        onClose={onCloseParticipantsModal}
        stallId={stallId}
        stallNo={stallNo}
        participants={participants}
      />

      <EditStallModal
        visible={showEditModal}
        onClose={onCloseEditModal}
        onStallUpdated={onStallUpdated}
        stallData={stallData}
      />

      <DeleteConfirmationModal
        visible={showDeleteModal}
        onClose={onCloseDeleteModal}
        onConfirm={onConfirmDelete}
        stallNo={stallNo}
        isDeleting={isDeleting}
      />

      <RaffleTimeModal
        visible={showRaffleTimeModal}
        onClose={onCloseRaffleTimeModal}
        onConfirm={onConfirmRaffleTime}
        stallNo={stallNo}
      />
    </>
  );
}