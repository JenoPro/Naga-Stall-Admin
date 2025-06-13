import React, { useState, useEffect } from "react";
import { Modal, View } from "react-native";
import styles from "../../../Styles/ManageStall";
import EditStallHeader from "./EditModal/EditStallHeader";
import EditStallForm from "./EditModal/EditStallForm";
import EditStallSubmitButton from "./EditModal/EditStallSubmitButton";
import EditStallCalendar from "./EditModal/EditStallCalendar";
import {
  validateStallData,
  uploadStallImage,
  updateStallData,
} from "../ViewParticipants/AddComponents/StallService";
import { pickStallImage } from "../ViewParticipants/AddComponents/ImagePickerService";
import {
  parseStallData,
  calculateRaffleDateTime,
} from "./EditModal/EditStallUtils";

export default function EditStallModal({
  visible,
  onClose,
  onStallUpdated,
  stallData,
}) {
  const [editStall, setEditStall] = useState({
    stallNo: "",
    stallLocation: "",
    size: "",
    rentalPrice: "",
    raffleDate: new Date(),
    raffleTime: { hours: 5, minutes: 0, period: "PM" },
    stallImage: null,
    status: "available",
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible && stallData) {
      const parsedStallData = parseStallData(stallData);
      setEditStall(parsedStallData);
    }
  }, [visible, stallData]);

  const handlePickStallImage = async () => {
    const imageUri = await pickStallImage();
    if (imageUri) {
      setEditStall({ ...editStall, stallImage: imageUri });
    }
  };

  const handleDateSelect = (selectedDate) => {
    setEditStall({ ...editStall, raffleDate: selectedDate });
    setShowCalendar(false);
  };

  const handleTimeSelect = (timeObj) => {
    setEditStall({ ...editStall, raffleTime: timeObj });
  };

  const handleSubmitStall = async () => {
    if (!validateStallData(editStall)) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imagePath = stallData.stallImage;

      if (editStall.stallImage !== stallData.stallImage) {
        const uploadedImagePath = await uploadStallImage(
          editStall.stallImage,
          editStall.stallNo
        );
        if (editStall.stallImage && !uploadedImagePath) {
          setIsSubmitting(false);
          return;
        }
        imagePath = uploadedImagePath;
      }

      const stallDataToUpdate = {
        stallNo: editStall.stallNo,
        stallLocation: editStall.stallLocation,
        size: editStall.size,
        rentalPrice: editStall.rentalPrice,
        raffleDate: editStall.raffleDate,
        raffleTime: editStall.raffleTime,
        stallImage: editStall.stallImage,
        status: editStall.status,
      };

      const updatedData = await updateStallData(
        stallData.stallId,
        stallDataToUpdate,
        imagePath
      );

      if (updatedData) {
        const combinedDateTime = calculateRaffleDateTime(
          editStall.raffleDate,
          editStall.raffleTime
        );

        const completeUpdatedStall = {
          ...stallData,
          ...updatedData,
          raffleTime: editStall.raffleTime,
          end_time: combinedDateTime,
        };

        if (onStallUpdated && typeof onStallUpdated === "function") {
          onStallUpdated(completeUpdatedStall);
        }

        onClose();
      }
    } catch (error) {
      console.log("❌ Unexpected error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <EditStallHeader
            stallNo={stallData?.stallNo}
            onClose={onClose}
            isSubmitting={isSubmitting}
          />

          <EditStallForm
            editStall={editStall}
            onStallDataChange={setEditStall}
            onImagePick={handlePickStallImage}
            onDatePickerOpen={() => setShowCalendar(true)}
            onTimeSelect={handleTimeSelect}
            isSubmitting={isSubmitting}
          />

          <EditStallSubmitButton
            onSubmit={handleSubmitStall}
            isSubmitting={isSubmitting}
          />
        </View>

        <EditStallCalendar
          visible={showCalendar}
          selectedDate={editStall.raffleDate}
          onDateSelect={handleDateSelect}
          onClose={() => setShowCalendar(false)}
        />
      </View>
    </Modal>
  );
}
