import { Alert } from "react-native";
import supabase from "../../../../config/supabaseClient";

export const validateStallData = (stallData) => {
  if (!stallData?.stallNo?.trim()) {
    Alert.alert("Error", "Please enter a stall number");
    return false;
  }

  if (!stallData?.stallLocation?.trim()) {
    Alert.alert("Error", "Please enter a location");
    return false;
  }

  if (!stallData?.size?.trim()) {
    Alert.alert("Error", "Please enter the size");
    return false;
  }

  const rentalPrice = stallData?.rentalPrice?.trim();
  if (!rentalPrice || isNaN(parseFloat(rentalPrice))) {
    Alert.alert("Error", "Please enter a valid rental price");
    return false;
  }

  return true;
};

export const uploadStallImage = async (imageUri, stallNo) => {
  if (!imageUri) return null;

  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const sanitizedStallNo = stallNo.replace(/\D/g, "");
    const timestamp = Date.now();
    const filename = `stall_${sanitizedStallNo}_${timestamp}.jpg`;
    const filePath = `stalls/${filename}`;

    console.log("✓ Uploading image to path:", filePath);

    const uploadTimeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Upload timeout")), 15000)
    );

    const uploadPromise = supabase.storage
      .from("stall-image")
      .upload(filePath, blob);

    const { data: fileData, error: fileError } = await Promise.race([
      uploadPromise,
      uploadTimeoutPromise,
    ]);

    if (fileError) {
      console.log("❌ Error uploading image:", fileError);
      Alert.alert("Error", "Failed to upload image");
      return null;
    }

    console.log("✓ Image uploaded successfully");
    return filePath;
  } catch (error) {
    console.log("❌ Error processing image:", error);
    Alert.alert("Error", "Failed to process the image");
    return null;
  }
};

export const insertStallData = async (stallData, imagePath) => {
  try {
    console.log("Inserting stall data:", {
      stallNo: stallData.stallNo,
      stallLocation: stallData.stallLocation,
      size: stallData.size,
      rentalPrice: stallData.rentalPrice,
    });

    const { data, error } = await supabase
      .from("Stall")
      .insert([
        {
          stallNo: stallData.stallNo,
          stallLocation: stallData.stallLocation,
          size: stallData.size,
          rentalPrice: parseFloat(stallData.rentalPrice),
          stallImage: imagePath,
          status: stallData.status,
          time_running: false,
        },
      ])
      .select();

    if (error) {
      console.log("❌ Error adding stall:", error);
      Alert.alert("Error", `Failed to add stall: ${error.message}`);
      return null;
    }

    console.log("✅ Added stall:", data);
    Alert.alert("Success", "Stall added successfully!");
    return data;
  } catch (error) {
    console.log("❌ Unexpected error:", error);
    Alert.alert("Error", "An unexpected error occurred");
    return null;
  }
};

export const calculateRaffleDateTime = (date, time) => {
  if (!date || !time) {
    console.warn("⚠️ Missing date or time for raffle calculation");
    return null;
  }

  try {
    const raffleDateTime = new Date(date);

    let hours = parseInt(time.hours);
    const minutes = parseInt(time.minutes);

    if (time.period === "PM" && hours !== 12) {
      hours += 12;
    } else if (time.period === "AM" && hours === 12) {
      hours = 0;
    }

    raffleDateTime.setHours(hours, minutes, 0, 0);

    console.log("🕒 Calculated raffle date/time:", raffleDateTime);
    return raffleDateTime;
  } catch (error) {
    console.error("❌ Error calculating raffle date/time:", error);
    return null;
  }
};

export const updateStallData = async (stallId, stallData, imagePath) => {
  try {
    console.log("🔄 Updating stall with ID:", stallId);
    console.log("🔄 Update data:", stallData);

    const updateData = {
      stallNo: stallData.stallNo,
      stallLocation: stallData.stallLocation,
      size: stallData.size,
      rentalPrice: parseFloat(stallData.rentalPrice),
      stallImage: imagePath,
      status: stallData.status,
    };

    const { data, error } = await supabase
      .from("Stall")
      .update(updateData)
      .eq("stallId", stallId)
      .select();

    if (error) {
      console.error("❌ Error updating stall:", error);
      Alert.alert("Error", `Failed to update stall: ${error.message}`);
      return null;
    }

    console.log("✅ Stall updated successfully:", data);
    Alert.alert("Success", "Stall updated successfully!");

    return data[0];
  } catch (error) {
    console.error("❌ Unexpected error updating stall:", error);
    Alert.alert("Error", "An unexpected error occurred. Please try again.");
    return null;
  }
};

export const deleteStallData = async (stallId) => {
  try {
    console.log("🗑️ Deleting stall with ID:", stallId);

    const { error: applicationError } = await supabase
      .from("Application")
      .delete()
      .eq("stallId", stallId);

    if (applicationError) {
      console.log(
        "⚠️ Note: Could not delete from Application table:",
        applicationError
      );
    }

    const { error: participantsError } = await supabase
      .from("participants")
      .delete()
      .eq("stallId", stallId);

    if (participantsError) {
      console.log(
        "⚠️ Note: Could not delete from participants table:",
        participantsError
      );
    }

    const { data, error: stallError } = await supabase
      .from("Stall")
      .delete()
      .eq("stallId", stallId)
      .select();

    if (stallError) {
      console.error("❌ Error deleting stall:", stallError);
      Alert.alert("Error", `Failed to delete stall: ${stallError.message}`);
      return false;
    }

    console.log("✅ Stall deleted successfully:", data);
    Alert.alert("Success", "Stall deleted successfully!");
    return true;
  } catch (error) {
    console.error("❌ Unexpected error deleting stall:", error);
    Alert.alert("Error", "An unexpected error occurred. Please try again.");
    return false;
  }
};

export const startStallTimer = async (stallId) => {
  try {
    const { data, error } = await supabase
      .from("Stall")
      .update({ time_running: true })
      .eq("stallId", stallId)
      .select();

    if (error) {
      console.log("❌ Error starting timer:", error);
      Alert.alert("Error", `Failed to start timer: ${error.message}`);
      return false;
    }

    console.log("✅ Timer started for stall:", stallId);
    return true;
  } catch (error) {
    console.log("❌ Unexpected error:", error);
    Alert.alert("Error", "An unexpected error occurred");
    return false;
  }
};

export const setRaffleTimeAndStart = async (
  stallId,
  raffleDateTime,
  raffleTime
) => {
  try {
    let endDateTime;

    if (raffleDateTime instanceof Date) {
      endDateTime = raffleDateTime;
    } else {
      endDateTime = new Date(raffleDateTime);
      if (raffleTime) {
        endDateTime.setHours(
          raffleTime.period === "PM" && raffleTime.hours !== 12
            ? raffleTime.hours + 12
            : raffleTime.period === "AM" && raffleTime.hours === 12
            ? 0
            : raffleTime.hours,
          raffleTime.minutes,
          0, // seconds
          0 // milliseconds
        );
      }
    }

    const endTimeTimestamp = endDateTime.getTime();

    console.log("Setting raffle time:", {
      stallId,
      raffleDateTime: endDateTime.toISOString(),
      endTimeTimestamp,
      currentTime: Date.now(),
      timeDifference: endTimeTimestamp - Date.now(),
    });

    const updateData = {
      time_running: true,
      status: "Countdown",
      end_time: endTimeTimestamp,
    };

    try {
      updateData.raffleDate = endDateTime.toISOString().split("T")[0];
    } catch (e) {
      console.log("Note: raffleDate column might not exist");
    }

    const { data, error } = await supabase
      .from("Stall")
      .update(updateData)
      .eq("stallId", stallId)
      .select();

    if (error) {
      console.log("❌ Error starting timer with raffle time:", error);

      console.log("Trying alternative timestamp format...");
      const alternativeUpdateData = {
        time_running: true,
        status: "Countdown",
        end_time: Math.floor(endTimeTimestamp / 1000),
      };

      const { data: altData, error: altError } = await supabase
        .from("Stall")
        .update(alternativeUpdateData)
        .eq("stallId", stallId)
        .select();

      if (altError) {
        console.log("❌ Alternative approach also failed:", altError);
        Alert.alert("Error", `Failed to start timer: ${altError.message}`);
        return false;
      }

      console.log("✅ Timer started with alternative approach (seconds)");
      return true;
    }

    console.log("✅ Timer started with raffle time for stall:", stallId);
    console.log("Updated data:", data);
    return true;
  } catch (error) {
    console.log("❌ Unexpected error:", error);
    Alert.alert("Error", "An unexpected error occurred");
    return false;
  }
};

export const completeRaffleTimer = async (stallId) => {
  try {
    const { data, error } = await supabase
      .from("Stall")
      .update({
        time_running: false,
        status: "Raffle",
        end_time: null,
      })
      .eq("stallId", stallId)
      .select();

    if (error) {
      console.log("❌ Error completing raffle:", error);
      return false;
    }

    console.log("✅ Raffle completed for stall:", stallId);
    return true;
  } catch (error) {
    console.log("❌ Unexpected error:", error);
    return false;
  }
};

export const clearStallTimer = async (stallId) => {
  try {
    const { data, error } = await supabase
      .from("Stall")
      .update({
        time_running: false,
        status: "available",
        end_time: null,
        raffleDate: null,
      })
      .eq("stallId", stallId)
      .select();

    if (error) {
      console.log("❌ Error clearing timer:", error);
      Alert.alert("Error", `Failed to clear timer: ${error.message}`);
      return false;
    }

    console.log("✅ Timer cleared for stall:", stallId);
    return true;
  } catch (error) {
    console.log("❌ Unexpected error:", error);
    Alert.alert("Error", "An unexpected error occurred");
    return false;
  }
};

export const stopStallTimer = async (stallId) => {
  try {
    const { data, error } = await supabase
      .from("Stall")
      .update({
        time_running: false,
        status: "available",
        end_time: null,
      })
      .eq("stallId", stallId)
      .select();

    if (error) {
      console.log("❌ Error stopping timer:", error);
      Alert.alert("Error", `Failed to stop timer: ${error.message}`);
      return false;
    }

    console.log("✅ Timer stopped for stall:", stallId);
    return true;
  } catch (error) {
    console.log("❌ Unexpected error:", error);
    Alert.alert("Error", "An unexpected error occurred");
    return false;
  }
};
