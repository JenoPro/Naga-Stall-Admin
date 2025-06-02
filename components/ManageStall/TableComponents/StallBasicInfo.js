import React from "react";
import { Text } from "react-native";
import styles from "../../../Styles/ManageStall";

export default function StallBasicInfo({ stallNo, stallLocation, size, rentalPrice }) {
  return (
    <>
      <Text style={[styles.tableCell, styles.stallNoCell]}>
        #{stallNo}
      </Text>
      <Text style={[styles.tableCell, styles.locationCell]}>
        {stallLocation}
      </Text>
      <Text style={[styles.tableCell, styles.sizeCell]}>
        {size}
      </Text>
      <Text style={[styles.tableCell, styles.amountCell]}>
        ₱{rentalPrice?.toLocaleString() || "0"}
      </Text>
    </>
  );
}