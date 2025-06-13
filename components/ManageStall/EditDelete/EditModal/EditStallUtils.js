export const parseEndTimeToRaffleTime = (endTime) => {
  if (!endTime) {
    return { hours: 5, minutes: 0, period: "PM" };
  }

  try {
    const date = new Date(typeof endTime === "number" ? endTime : endTime);

    if (isNaN(date.getTime())) {
      console.log("⚠️ Invalid date from end_time:", endTime);
      return { hours: 5, minutes: 0, period: "PM" };
    }

    let hours = date.getHours();
    const minutes = date.getMinutes();
    let period = "AM";

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

export const parseRaffleDate = (raffleDate, endTime) => {
  let parsedDate = new Date();

  if (raffleDate) {
    if (typeof raffleDate === "string") {
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
    parsedDate = new Date(typeof endTime === "number" ? endTime : endTime);
  }

  if (isNaN(parsedDate.getTime())) {
    console.log("⚠️ Invalid date, using current date");
    parsedDate = new Date();
  }

  console.log("✅ Parsed raffle date:", parsedDate);
  return parsedDate;
};

export const parseStallData = (stallData) => {
  console.log("💡 Populating form with stall data:", stallData);

  const parsedRaffleDate = parseRaffleDate(
    stallData.raffleDate,
    stallData.end_time
  );

  let parsedRaffleTime = { hours: 5, minutes: 0, period: "PM" };

  if (stallData.raffleTime) {
    parsedRaffleTime = stallData.raffleTime;
    console.log("✅ Using existing raffleTime:", parsedRaffleTime);
  } else if (stallData.end_time) {
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

export const calculateRaffleDateTime = (date, time) => {
  if (!date || !time) {
    console.warn("⚠️ Missing date or time for raffle calculation");
    return null;
  }

  try {
    const raffleDateTime = new Date(date);

    let hours, minutes, period;

    if (typeof time === "string") {
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
      hours = parseInt(time.hours);
      minutes = parseInt(time.minutes);
      period = time.period.toUpperCase();
    }

    if (hours === undefined || minutes === undefined || !period) {
      console.warn("⚠️ Could not parse time format:", time);
      return raffleDateTime;
    }

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    raffleDateTime.setHours(hours, minutes, 0, 0);

    console.log("🕒 Calculated raffle date/time:", raffleDateTime);
    return raffleDateTime;
  } catch (error) {
    console.error("❌ Error calculating raffle date/time:", error);
    return new Date(date);
  }
};
