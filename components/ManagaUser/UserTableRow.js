import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../Styles/ManageStall";

const UserTableRow = ({
  item,
  emailSending,
  onAccept,
  onDecline,
  onViewImage,
  onResendCredentials,
}) => {
  return (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.idCell]}>
        {item.registrationId}
      </Text>
      <Text style={[styles.tableCell, styles.nameCell]}>{item.fullName}</Text>
      <Text style={[styles.tableCell, styles.emailCell]}>
        {item.emailAddress}
      </Text>
      <Text style={[styles.tableCell, styles.phoneCell]}>
        {item.phoneNumber}
      </Text>
      <Text style={[styles.tableCell, styles.addressCell]}>{item.address}</Text>

      <View style={[styles.tableCell, styles.validCell]}>
        {item.validId ? (
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => onViewImage(item.validId, item.fullName)}
          >
            <Text style={styles.viewButtonText}>View ID</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.noIdText}>No ID</Text>
        )}
      </View>

      <View style={[styles.tableCell, styles.actionsCell]}>
        {item.status === "approved" ? (
          <View style={styles.acceptedContainer}>
            <Text style={styles.acceptedText}>ACCEPTED</Text>
            {item.userName && item.password && (
              <TouchableOpacity
                style={styles.resendButton}
                disabled={emailSending}
                onPress={() =>
                  onResendCredentials(
                    item.registrationId,
                    item.emailAddress,
                    Array.isArray(item.userName)
                      ? item.userName[0]
                      : item.userName,
                    Array.isArray(item.password)
                      ? item.password[0]
                      : item.password
                  )
                }
              >
                <Text style={styles.resendButtonText}>
                  {emailSending ? "Sending..." : "📧 Resend"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : item.status === "declined" ? (
          <Text style={styles.declinedText}>DECLINED</Text>
        ) : (
          <>
            <TouchableOpacity
              style={styles.acceptButton}
              disabled={emailSending}
              onPress={() => onAccept(item.registrationId, item.emailAddress)}
            >
              <Text style={styles.acceptButtonText}>ACCEPT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              disabled={emailSending}
              onPress={() => onDecline(item.registrationId)}
            >
              <Text style={styles.declineButtonText}>DECLINE</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default UserTableRow;
