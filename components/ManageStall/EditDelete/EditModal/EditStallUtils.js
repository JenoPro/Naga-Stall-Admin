// Better parsing of end_time to raffleTime
export const parseEndTimeToRaffleTime = (endTime) => {
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

// Better date parsing from raffleDate and end_time
export const parseRaffleDate = (raffleDate, endTime) => {
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

// Parse stall data for form initialization
export const parseStallData = (stallData) => {
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

  return {
    stallNo: stallData.stallNo || "",
    stallLocation: stallData.stallLocation || "",
    size: stallData.size || "",
    rentalPrice: stallData.rentalPrice?.toString() || "",
    raffleDate: parsedRaffleDate,
    raffleTime: parsedRaffleTime,
    stallImage: stallData.stallImage || null,
    status: stallData.status || "available",
  };
};

// Calculate combined date/time for raffle
export const calculateRaffleDateTime = (date, time) => {
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