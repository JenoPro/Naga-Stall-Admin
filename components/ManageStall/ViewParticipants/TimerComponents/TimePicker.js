import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const TimePicker = ({ visible, selectedTime, onTimeSelect, onClose }) => {
  const [hours, setHours] = useState(selectedTime ? selectedTime.hours : 12);
  const [minutes, setMinutes] = useState(selectedTime ? selectedTime.minutes : 0);
  const [period, setPeriod] = useState(selectedTime ? selectedTime.period : 'PM');

  // Generate hours (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Generate minutes (0-59 in 5 minute intervals)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleConfirm = () => {
    const timeObj = { hours, minutes, period };
    onTimeSelect(timeObj);
    onClose();
  };

  const formatTime = () => {
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${hours}:${formattedMinutes} ${period}`;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Raffle Time</Text>
          </View>
          
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>{formatTime()}</Text>
          </View>

          <View style={styles.pickersContainer}>
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Hour</Text>
              <Picker
                selectedValue={hours}
                style={styles.picker}
                onValueChange={setHours}
              >
                {hourOptions.map(hour => (
                  <Picker.Item key={hour} label={hour.toString()} value={hour} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Minute</Text>
              <Picker
                selectedValue={minutes}
                style={styles.picker}
                onValueChange={setMinutes}
              >
                {minuteOptions.map(minute => (
                  <Picker.Item 
                    key={minute} 
                    label={minute.toString().padStart(2, '0')} 
                    value={minute} 
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>AM/PM</Text>
              <Picker
                selectedValue={period}
                style={styles.picker}
                onValueChange={setPeriod}
              >
                <Picker.Item label="AM" value="AM" />
                <Picker.Item label="PM" value="PM" />
              </Picker>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
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
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  timeDisplay: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  picker: {
    width: 80,
    height: 150,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#2196f3',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TimePicker;