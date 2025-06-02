import React from "react";
import StallForm from "../../ViewParticipants/AddComponents/StallForm";

export default function EditStallForm({
  editStall,
  onStallDataChange,
  onImagePick,
  onDatePickerOpen,
  onTimeSelect,
  isSubmitting,
}) {
  return (
    <StallForm
      stallData={editStall}
      onStallDataChange={onStallDataChange}
      onImagePick={onImagePick}
      onDatePickerOpen={onDatePickerOpen}
      onTimeSelect={onTimeSelect}
      isSubmitting={isSubmitting}
    />
  );
}