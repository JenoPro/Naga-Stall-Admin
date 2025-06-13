import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import CalendarPicker from "../AddComponents/CalendarPicker";
import TimePicker from "../TimerComponents/TimePicker";

const RaffleTimeModal = ({ visible, onClose, onConfirm, stallNo }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState({
    hours: 5,
    minutes: 0,
    period: "PM",
  });

  const handleConfirm = () => {
    const raffleDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    let hours = parseInt(selectedTime.hours);
    if (selectedTime.period === "PM" && hours !== 12) {
      hours += 12;
    } else if (selectedTime.period === "AM" && hours === 12) {
      hours = 0;
    }

    raffleDateTime.setHours(hours, parseInt(selectedTime.minutes), 0, 0);

    console.log("RaffleTimeModal - Selected:", {
      originalDate: selectedDate,
      selectedTime: selectedTime,
      finalDateTime: raffleDateTime,
      timestamp: raffleDateTime.getTime(),
    });

    const now = new Date();
    if (raffleDateTime <= now) {
      Alert.alert("Error", "Raffle time must be in the future");
      return;
    }

    onConfirm(raffleDateTime, selectedTime);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Set Raffle Time for Stall #{stallNo}
          </Text>

          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setShowCalendar(true)}
          >
            <Text style={styles.selectionText}>
              Date: {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.selectionText}>
              Time: {selectedTime.hours}:
              {selectedTime.minutes.toString().padStart(2, "0")}{" "}
              {selectedTime.period}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Start Timer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <CalendarPicker
          visible={showCalendar}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onClose={() => setShowCalendar(false)}
        />

        <TimePicker
          visible={showTimePicker}
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
          onClose={() => setShowTimePicker(false)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  selectionButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default RaffleTimeModal;
