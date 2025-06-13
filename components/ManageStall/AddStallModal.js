import React, { useState } from "react";
import { Text, View, TouchableOpacity, Modal } from "react-native";
import styles from "../../Styles/ManageStall";
import StallForm from "./ViewParticipants/AddComponents/StallForm";
import CalendarPicker from "./ViewParticipants/AddComponents/CalendarPicker";
import { pickStallImage } from "./ViewParticipants/AddComponents/ImagePickerService";
import {
  validateStallData,
  uploadStallImage,
  insertStallData,
} from "./ViewParticipants/AddComponents/StallService";

export default function AddStallModal({ visible, onClose, onStallAdded }) {
  const [newStall, setNewStall] = useState({
    stallNo: "",
    stallLocation: "",
    size: "",
    rentalPrice: "",
    stallImage: null,
    status: "available",
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setNewStall({
        stallNo: "",
        stallLocation: "",
        size: "",
        rentalPrice: "",
        raffleDate: new Date(),
        raffleTime: { hours: 5, minutes: 0, period: "PM" },
        stallImage: null,
        status: "available",
      });
    }
  }, [visible]);

  const handlePickStallImage = async () => {
    const imageUri = await pickStallImage();
    if (imageUri) {
      setNewStall({
        ...newStall,
        stallImage: imageUri,
      });
    }
  };

  const handleDateSelect = (selectedDate) => {
    setNewStall({ ...newStall, raffleDate: selectedDate });
  };

  const handleSubmitStall = async () => {
    console.log("Submitting stall data:", {
      ...newStall,
      raffleDate: newStall.raffleDate.toISOString(),
      raffleTime: newStall.raffleTime,
    });

    if (!validateStallData(newStall)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const imagePath = await uploadStallImage(
        newStall.stallImage,
        newStall.stallNo
      );

      if (newStall.stallImage && !imagePath) {
        setIsSubmitting(false);
        return;
      }

      const data = await insertStallData(newStall, imagePath);

      if (data) {
        onStallAdded(data);
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Stall</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <StallForm
            stallData={newStall}
            onStallDataChange={setNewStall}
            onImagePick={handlePickStallImage}
            onDatePickerOpen={() => setShowCalendar(true)}
            isSubmitting={isSubmitting}
          />

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmitStall}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Submitting..." : "SUBMIT STALL"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Custom Calendar Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showCalendar}
          onRequestClose={() => setShowCalendar(false)}
        >
          <View style={styles.calendarOverlay}>
            <CalendarPicker
              selectedDate={newStall.raffleDate}
              onDateSelect={handleDateSelect}
              onClose={() => setShowCalendar(false)}
            />
          </View>
        </Modal>
      </View>
    </Modal>
  );
}
