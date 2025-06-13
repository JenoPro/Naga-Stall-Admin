import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "../../../../Styles/ViewParticipantsModal";
import supabase from "../../../../config/supabaseClient";
import { sendStatusNotificationEmail } from "../../../../services/emailService";

const formatDate = (dateString) => {
  if (!dateString) return "Not provided";
  return new Date(dateString).toLocaleDateString();
};

export default function ApplicationStatus({ applicant, onStatusUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [manualEmail, setManualEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handleApprove = async () => {
    if (window.confirm("Are you sure you want to approve this application?")) {
      updateApplicationStatus("approved");
    }
  };

  const handleReject = async () => {
    if (window.confirm("Are you sure you want to reject this application?")) {
      updateApplicationStatus("rejected");
    }
  };

  const updateApplicationStatus = async (newStatus) => {
    setIsUpdating(true);

    try {
      console.log(
        "🔍 Complete applicant object:",
        JSON.stringify(applicant, null, 2)
      );
      console.log("🔍 Available properties:", Object.keys(applicant));

      const applicationId = applicant.ApplicationId;

      if (!applicationId) {
        console.log("❌ No ApplicationId found in applicant object");
        window.alert("Error: Cannot identify application to update");
        return;
      }

      console.log("Updating application with ApplicationId:", applicationId);

      const { error: updateError } = await supabase
        .from("Application")
        .update({ status: newStatus })
        .eq("ApplicationId", applicationId);

      if (updateError) {
        console.log("❌ Error updating status:", updateError);
        window.alert(
          `Failed to update application status: ${updateError.message}`
        );
        return;
      }

      console.log("✅ Status updated successfully");

      const { data: applicationData, error: fetchAppError } = await supabase
        .from("Application")
        .select("Applicants_Name, registrationId")
        .eq("ApplicationId", applicationId)
        .single();

      if (fetchAppError) {
        console.log("❌ Error fetching application data:", fetchAppError);
        window.alert(
          `Application ${newStatus} successfully, but failed to fetch application data: ${fetchAppError.message}`
        );
        return;
      }

      console.log("📋 Fetched application data:", applicationData);

      const registrationId = applicationData?.registrationId;
      const userName = applicationData?.Applicants_Name || "User";

      if (!registrationId) {
        console.log("❌ No registrationId found in application");
        window.alert(
          `Application ${newStatus} successfully, but no registration ID found for email notification.`
        );
        return;
      }

      const { data: registrantData, error: fetchRegError } = await supabase
        .from("Registrant")
        .select("emailAddress")
        .eq("registrationId", registrationId)
        .single();

      if (fetchRegError) {
        console.log("❌ Error fetching registrant data:", fetchRegError);
        window.alert(
          `Application ${newStatus} successfully, but failed to fetch registrant data: ${fetchRegError.message}`
        );
        return;
      }

      console.log("📋 Fetched registrant data:", registrantData);

      const userEmail = registrantData?.emailAddress;

      console.log("👤 Found name:", userName);
      console.log("📧 Found email:", userEmail);

      if (userEmail) {
        try {
          console.log(`📧 Sending ${newStatus} notification to:`, userEmail);

          const emailSuccess = await sendStatusNotificationEmail(
            userEmail,
            userName,
            newStatus
          );

          if (emailSuccess) {
            window.alert(
              `Application ${newStatus} successfully. Email notification sent to ${userEmail}`
            );
          } else {
            window.alert(
              `Application ${newStatus} successfully, but failed to send email notification.`
            );
          }
        } catch (emailError) {
          console.log("❌ Email error:", emailError);
          window.alert(
            `Application ${newStatus} successfully, but failed to send email notification: ${emailError.message}`
          );
        }
      } else {
        console.log("❌ No email address found in registrant data");
        window.alert(
          `Application ${newStatus} successfully, but no email address found for notification.`
        );
      }

      if (onStatusUpdate) {
        onStatusUpdate(applicationId, newStatus);
      }
    } catch (error) {
      console.log("❌ Unexpected error:", error);
      window.alert(
        "An unexpected error occurred while updating the application."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return styles.approvedStatus;
      case "rejected":
        return styles.rejectedStatus;
      case "applied":
      default:
        return styles.pendingStatus;
    }
  };

  const currentStatus = applicant.status || "applied";

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Application Status</Text>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Status:</Text>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.detailValue,
              styles.statusText,
              getStatusColor(currentStatus),
            ]}
          >
            {currentStatus}
          </Text>

          {/* Show buttons only if status is 'applied' or 'pending' */}
          {(currentStatus === "applied" || currentStatus === "pending") && (
            <View style={styles.actionButtonsContainer}>
              {isUpdating ? (
                <ActivityIndicator
                  size="small"
                  color="#007AFF"
                  style={styles.loadingIndicator}
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={handleApprove}
                    disabled={isUpdating}
                  >
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={handleReject}
                    disabled={isUpdating}
                  >
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Application Date:</Text>
        <Text style={styles.detailValue}>
          {formatDate(applicant.created_at)}
        </Text>
      </View>
    </View>
  );
}
