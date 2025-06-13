import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_e2awvdk";
const EMAILJS_TEMPLATE_ID = "template_r6kxcnh";
const EMAILJS_USER_ID = "sTpDE-Oq2-9XH_UZd";
const SENDER_EMAIL = "requiem121701@gmail.com";
const SENDER_NAME = "Juggernaut Exe";

emailjs.init(EMAILJS_USER_ID);

export const sendAutomatedEmail = async (
  recipientEmail,
  username,
  password,
  setEmailSending
) => {
  if (setEmailSending) setEmailSending(true);

  try {
    console.log("📧 Attempting to send email to:", recipientEmail);
    console.log("📧 Using service ID:", EMAILJS_SERVICE_ID);
    console.log("📧 Using template ID:", EMAILJS_TEMPLATE_ID);

    const templateParams = {
      to_email: recipientEmail,
      to_name: "User",
      from_name: SENDER_NAME,
      from_email: SENDER_EMAIL,
      subject: "Your Account Credentials - Stall Management System",
      username: username,
      password: password,
      message: `Hello,\n\nYour account has been approved! Here are your login credentials:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease change your password after your first login for security.\n\nBest regards,\nAdmin Team`,
    };

    console.log("📧 Template params:", templateParams);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_USER_ID
    );

    console.log("✅ Email sent successfully:", response);

    if (typeof window !== "undefined" && window.alert) {
      window.alert(`✅ Credentials successfully sent to ${recipientEmail}!`);
    }

    return true;
  } catch (error) {
    console.error("❌ Detailed email error:", error);
    console.error("❌ Error status:", error.status);
    console.error("❌ Error text:", error.text);

    let errorMessage = "Failed to send credentials";

    if (error.status === 400) {
      errorMessage =
        "Email service configuration error. Please check your EmailJS settings.";
    } else if (error.status === 401) {
      errorMessage =
        "Unauthorized. Please check your EmailJS User ID and API keys.";
    } else if (error.status === 402) {
      errorMessage =
        "EmailJS quota exceeded. Please check your EmailJS account.";
    } else if (error.status === 403) {
      errorMessage =
        "Forbidden. Please check your EmailJS service permissions.";
    } else if (error.status === 404) {
      errorMessage =
        "EmailJS service or template not found. Please verify your IDs.";
    } else if (error.text) {
      errorMessage = `Failed to send credentials: ${error.text}`;
    } else if (error.message) {
      errorMessage = `Failed to send credentials: ${error.message}`;
    }

    if (typeof window !== "undefined" && window.alert) {
      window.alert(`❌ ${errorMessage}`);
    }

    return false;
  } finally {
    if (setEmailSending) setEmailSending(false);
  }
};

export const sendStatusNotificationEmail = async (
  recipientEmail,
  userName,
  status
) => {
  try {
    console.log(`📧 Sending ${status} notification to:`, recipientEmail);

    const isApproved = status === "approved";
    const subject = isApproved
      ? "Application Approved - Stall Management System"
      : `Application ${
          status.charAt(0).toUpperCase() + status.slice(1)
        } - Stall Management System`;

    const message = isApproved
      ? `Hello ${userName},\n\nCongratulations! Your application has been approved. Wait for the raffle to start - always check the stall if the countdown already starts.\n\nBest regards,\nAdmin Team`
      : `Hello ${userName},\n\nWe regret to inform you that your application has been ${status}.\n\nIf you have any questions or would like to reapply in the future, please don't hesitate to contact us.\n\nThank you for your interest.\n\nBest regards,\nAdmin Team`;

    const templateParams = {
      to_email: recipientEmail,
      to_name: userName,
      from_name: SENDER_NAME,
      from_email: SENDER_EMAIL,
      subject: subject,
      message: message,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_USER_ID
    );

    if (response.status === 200) {
      console.log("✅ Status notification email sent successfully:", response);
      return true;
    } else {
      console.log("❌ Failed to send status notification email:", response);
      return false;
    }
  } catch (error) {
    console.error("❌ Error sending status notification email:", error);
    return false;
  }
};
