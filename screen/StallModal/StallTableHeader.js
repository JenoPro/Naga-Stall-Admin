import React from "react";
import { View, Text } from "react-native";
import styles from "../../Styles/ManageStall";

export default function StallTableHeader() {
  return (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell, styles.imageCell]}>Image</Text>
      <Text style={[styles.tableHeaderCell, styles.stallIdCell]}>
        Stall No.
      </Text>
      <Text style={[styles.tableHeaderCell, styles.locationCell]}>
        Location
      </Text>
      <Text style={[styles.tableHeaderCell, styles.sizeCell]}>Size</Text>
      <Text style={[styles.tableHeaderCell, styles.amountCell]}>
        Amount
      </Text>
      <Text style={[styles.tableHeaderCell, styles.dateCell]}>
        Date of Raffle
      </Text>
      <Text style={[styles.tableHeaderCell, styles.applicantsCell]}>
        Applicants
      </Text>
      <Text style={[styles.tableHeaderCell, styles.actionsCell]}>
        Actions
      </Text>
    </View>
  );
}