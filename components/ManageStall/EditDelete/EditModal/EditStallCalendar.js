import React from "react";
import { Modal, View } from "react-native";
import CalendarPicker from "../../ViewParticipants/AddComponents/CalendarPicker";
import styles from "../../../../Styles/ManageStall";

export default function EditStallCalendar({
  visible,
  selectedDate,
  onDateSelect,
  onClose,
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.calendarOverlay}>
        <CalendarPicker
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          onClose={onClose}
        />
      </View>
    </Modal>
  );
}