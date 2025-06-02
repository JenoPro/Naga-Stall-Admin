import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Modal } from "react-native";
import styles from "../../../Styles/ManageStall";
import StallForm from "../ViewParticipants/AddComponents/StallForm";
import CalendarPicker from "../ViewParticipants/AddComponents/CalendarPicker";
import { pickStallImage } from "../ViewParticipants/AddComponents/ImagePickerService";
import {
  validateStallData,
  uploadStallImage,
  updateStallData,
  calculateRaffleDateTime,
} from "../ViewParticipants/AddComponents/StallService";

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

  // FIXED: Better parsing of end_time to raffleTime
  const parseEndTimeToRaffleTime = (endTime) => {
    if (!endTime) {
      return { hours: 5, minutes: 0, period: "PM" };
    }

    try {
      // Handle both timestamp (number) and date string formats
      const date = new Date(typeof endTime === "number" ? endTime : endTime);

      if (isNaN(date.getTime())) {
        console.log("⚠️ Invalid date from end_time:", endTime);
        return { hours: 5, minutes: 0, period: "PM" };
      }

      let hours = date.getHours();
      const minutes = date.getMinutes();
      let period = "AM";

      // Convert 24-hour to 12-hour format
      if (hours === 0) {
        hours = 12;
        period = "AM";
      } else if (hours < 12) {
        period = "AM";
      } else if (hours === 12) {
        period = "PM";
      } else {
        hours -= 12;
        period = "PM";
      }

      console.log("✅ Parsed time from end_time:", { hours, minutes, period });
      return { hours, minutes, period };
    } catch (error) {
      console.log("❌ Error parsing end_time:", error);
      return { hours: 5, minutes: 0, period: "PM" };
    }
  };

  // FIXED: Better date parsing from raffleDate and end_time
  const parseRaffleDate = (raffleDate, endTime) => {
    let parsedDate = new Date();

    if (raffleDate) {
      // Handle string dates like "2024-12-25"
      if (typeof raffleDate === "string") {
        // For date strings in YYYY-MM-DD format, create date without timezone issues
        const dateParts = raffleDate.split("-");
        if (dateParts.length === 3) {
          parsedDate = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          );
        } else {
          parsedDate = new Date(raffleDate);
        }
      } else {
        parsedDate = new Date(raffleDate);
      }
    } else if (endTime) {
      // If no raffleDate but we have end_time, extract date from end_time
      parsedDate = new Date(typeof endTime === "number" ? endTime : endTime);
    }

    // Ensure it's a valid date
    if (isNaN(parsedDate.getTime())) {
      console.log("⚠️ Invalid date, using current date");
      parsedDate = new Date();
    }

    console.log("✅ Parsed raffle date:", parsedDate);
    return parsedDate;
  };

  // FIXED: Populate form with existing stall data when modal opens
  useEffect(() => {
    if (visible && stallData) {
      console.log("💡 Populating form with stall data:", stallData);

      // Parse the raffle date
      const parsedRaffleDate = parseRaffleDate(
        stallData.raffleDate,
        stallData.end_time
      );

      // Parse the raffle time
      let parsedRaffleTime = { hours: 5, minutes: 0, period: "PM" };

      if (stallData.raffleTime) {
        // If raffleTime already exists in the correct format
        parsedRaffleTime = stallData.raffleTime;
        console.log("✅ Using existing raffleTime:", parsedRaffleTime);
      } else if (stallData.end_time) {
        // Parse from end_time timestamp
        parsedRaffleTime = parseEndTimeToRaffleTime(stallData.end_time);
        console.log("✅ Parsed raffleTime from end_time:", parsedRaffleTime);
      }

      console.log("💡 Final parsed time:", parsedRaffleTime);
      console.log("💡 Final parsed date:", parsedRaffleDate);

      setEditStall({
        stallNo: stallData.stallNo || "",
        stallLocation: stallData.stallLocation || "",
        size: stallData.size || "",
        rentalPrice: stallData.rentalPrice?.toString() || "",
        raffleDate: parsedRaffleDate,
        raffleTime: parsedRaffleTime,
        stallImage: stallData.stallImage || null,
        status: stallData.status || "available",
      });
    }
  }, [visible, stallData]);

  // Handle image selection for edit stall
  const handlePickStallImage = async () => {
    const imageUri = await pickStallImage();
    if (imageUri) {
      setEditStall({
        ...editStall,
        stallImage: imageUri,
      });
    }
  };

  // Handle date selection from calendar
  const handleDateSelect = (selectedDate) => {
    console.log("📅 Date selected:", selectedDate);
    setEditStall({ ...editStall, raffleDate: selectedDate });
    setShowCalendar(false);
  };

  // Handle time selection
  const handleTimeSelect = (timeObj) => {
    console.log("🕐 Time selected:", timeObj);
    setEditStall({ ...editStall, raffleTime: timeObj });
  };

  // FIXED: Handle submit edited stall with proper callback
  const handleSubmitStall = async () => {
    console.log("🚀 Submitting stall update with data:", editStall);

    // Validate form
    if (!validateStallData(editStall)) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imagePath = stallData.stallImage; // Keep existing image by default

      // Upload new image if selected
      if (editStall.stallImage !== stallData.stallImage) {
        const uploadedImagePath = await uploadStallImage(
          editStall.stallImage,
          editStall.stallNo
        );
        if (editStall.stallImage && !uploadedImagePath) {
          // Image upload failed
          setIsSubmitting(false);
          return;
        }
        imagePath = uploadedImagePath;
      }

      // Helper function to calculate combined date/time
      const calculateRaffleDateTime = (date, time) => {
        if (!date || !time) {
          console.warn("⚠️ Missing date or time for raffle calculation");
          return null;
        }

        try {
          // Create a new date object from the provided date
          const raffleDateTime = new Date(date);

          // Parse the time - handle both string and object formats
          let hours, minutes, period;

          if (typeof time === "string") {
            // If time is a string like "3:00 PM"
            const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (timeMatch) {
              hours = parseInt(timeMatch[1]);
              minutes = parseInt(timeMatch[2]);
              period = timeMatch[3].toUpperCase();
            }
          } else if (
            typeof time === "object" &&
            time.hours &&
            time.minutes &&
            time.period
          ) {
            // If time is an object like {hours: 3, minutes: 0, period: 'PM'}
            hours = parseInt(time.hours);
            minutes = parseInt(time.minutes);
            period = time.period.toUpperCase();
          }

          if (hours === undefined || minutes === undefined || !period) {
            console.warn("⚠️ Could not parse time format:", time);
            return raffleDateTime; // Return date without time modification
          }

          // Convert to 24-hour format if needed
          if (period === "PM" && hours !== 12) {
            hours += 12;
          } else if (period === "AM" && hours === 12) {
            hours = 0;
          }

          // Set the time
          raffleDateTime.setHours(hours, minutes, 0, 0);

          console.log("🕒 Calculated raffle date/time:", raffleDateTime);
          return raffleDateTime;
        } catch (error) {
          console.error("❌ Error calculating raffle date/time:", error);
          return new Date(date); // Return original date if calculation fails
        }
      };

      // Prepare stall data with raffleTime included
      const stallDataToUpdate = {
        stallNo: editStall.stallNo,
        stallLocation: editStall.stallLocation,
        size: editStall.size,
        rentalPrice: editStall.rentalPrice,
        raffleDate: editStall.raffleDate,
        raffleTime: editStall.raffleTime, // Make sure raffleTime is included
        stallImage: editStall.stallImage,
        status: editStall.status,
      };

      console.log("📤 Sending update data:", stallDataToUpdate);

      const updatedData = await updateStallData(
        stallData.stallId,
        stallDataToUpdate,
        imagePath
      );

      if (updatedData) {
        console.log("✅ Stall updated successfully:", updatedData);

        // Calculate the combined date/time for end_time
        const combinedDateTime = calculateRaffleDateTime(
          editStall.raffleDate,
          editStall.raffleTime
        );

        // FIXED: Create complete updated stall object with all necessary fields
        const completeUpdatedStall = {
          ...stallData, // Keep original data
          ...updatedData, // Merge with updated data
          raffleTime: editStall.raffleTime, // Ensure raffleTime is preserved
          end_time: combinedDateTime, // Use the calculated combined date/time
        };

        console.log("🎯 Complete updated stall object:", completeUpdatedStall);

        // Call the callback with the complete updated data
        if (onStallUpdated && typeof onStallUpdated === "function") {
          onStallUpdated(completeUpdatedStall);
        }

        // Close the modal
        onClose();
      }
    } catch (error) {
      console.log("❌ Unexpected error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateRaffleDateTime = (date, time) => {
    if (!date || !time) {
      console.warn("⚠️ Missing date or time for raffle calculation");
      return null;
    }

    try {
      // Create a new date object from the provided date
      const raffleDateTime = new Date(date);

      // Parse the time
      let hours = parseInt(time.hours);
      const minutes = parseInt(time.minutes);

      // Convert to 24-hour format if needed
      if (time.period === "PM" && hours !== 12) {
        hours += 12;
      } else if (time.period === "AM" && hours === 12) {
        hours = 0;
      }

      // Set the time
      raffleDateTime.setHours(hours, minutes, 0, 0);

      console.log("🕒 Calculated raffle date/time:", raffleDateTime);
      return raffleDateTime;
    } catch (error) {
      console.error("❌ Error calculating raffle date/time:", error);
      return null;
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
            <Text style={styles.modalTitle}>
              Edit Stall #{stallData?.stallNo}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <StallForm
            stallData={editStall}
            onStallDataChange={setEditStall}
            onImagePick={handlePickStallImage}
            onDatePickerOpen={() => setShowCalendar(true)}
            onTimeSelect={handleTimeSelect}
            isSubmitting={isSubmitting}
          />

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmitStall}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Updating..." : "UPDATE STALL"}
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
              selectedDate={editStall.raffleDate}
              onDateSelect={handleDateSelect}
              onClose={() => setShowCalendar(false)}
            />
          </View>
        </Modal>
      </View>
    </Modal>
  );
}
