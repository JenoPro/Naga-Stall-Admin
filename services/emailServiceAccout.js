import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_e2awvdk";
const EMAILJS_TEMPLATE_ID = "template_r6kxcnh";
const EMAILJS_PUBLIC_KEY = "sTpDE-Oq2-9XH_UZd";
const SENDER_EMAIL = "requiem121701@gmail.com";
const SENDER_NAME = "Juggernaut Exe";

let isInitialized = false;

const initializeEmailJS = () => {
  if (!isInitialized) {
    try {
      emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
        blockHeadless: false,
        blockList: {
          list: [],
          watchVariable: "userAgent",
        },
        limitRate: {
          id: "app",
          throttle: 5000,
        },
      });
      isInitialized = true;
      console.log("✅ EmailJS initialized successfully");
    } catch (error) {
      console.error("❌ EmailJS initialization failed:", error);

      emailjs.init(EMAILJS_PUBLIC_KEY);
      isInitialized = true;
    }
  }
};

export const sendCredentialsEmailFetch = async (
  recipientEmail,
  username,
  password
) => {
  try {
    console.log("📧 Sending email via fetch method to:", recipientEmail);

    const templateParams = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        from_name: SENDER_NAME,
        from_email: SENDER_EMAIL,
        to_email: recipientEmail,
        subject: "Your Account Credentials - Registration Approved",
        message: `Hello,

Congratulations! Your registration has been approved.

Here are your login credentials:
Username: ${username}
Password: ${password}

Please save these credentials securely and change your password after your first login.

Best regards,
Admin Team`,
        username: username,
        password: password,
        reply_to: SENDER_EMAIL,
      },
    };

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify(templateParams),
      }
    );

    if (response.ok) {
      console.log("✅ Email sent successfully via fetch");
      return {
        success: true,
        message: `Credentials sent to ${recipientEmail}`,
      };
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("❌ Fetch method failed:", error);
    return {
      success: false,
      message: `Failed to send email via fetch: ${error.message}`,
    };
  }
};

export const sendCredentialsEmailXHR = async (
  recipientEmail,
  username,
  password
) => {
  return new Promise((resolve) => {
    try {
      console.log("📧 Sending email via XHR method to:", recipientEmail);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://api.emailjs.com/api/v1.0/email/send", true);
      xhr.setRequestHeader("Content-Type", "application/json");

      const templateParams = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name: SENDER_NAME,
          from_email: SENDER_EMAIL,
          to_email: recipientEmail,
          subject: "Your Account Credentials - Registration Approved",
          message: `Hello,

Congratulations! Your registration has been approved.

Here are your login credentials:
Username: ${username}
Password: ${password}

Please save these credentials securely and change your password after your first login.

Best regards,
Admin Team`,
          username: username,
          password: password,
          reply_to: SENDER_EMAIL,
        },
      };

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log("✅ Email sent successfully via XHR");
            resolve({
              success: true,
              message: `Credentials sent to ${recipientEmail}`,
            });
          } else {
            console.error("❌ XHR method failed:", xhr.responseText);
            resolve({
              success: false,
              message: `Failed to send email via XHR: ${xhr.statusText}`,
            });
          }
        }
      };

      xhr.onerror = function () {
        console.error("❌ XHR network error");
        resolve({
          success: false,
          message: "Network error occurred while sending email",
        });
      };

      xhr.send(JSON.stringify(templateParams));
    } catch (error) {
      console.error("❌ XHR method error:", error);
      resolve({
        success: false,
        message: `XHR method failed: ${error.message}`,
      });
    }
  });
};

export const sendCredentialsEmailImproved = async (
  recipientEmail,
  username,
  password
) => {
  initializeEmailJS();

  try {
    console.log(
      "📧 Sending email via improved EmailJS method to:",
      recipientEmail
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const templateParams = {
      from_name: SENDER_NAME,
      from_email: SENDER_EMAIL,
      to_email: recipientEmail,
      subject: "Your Account Credentials - Registration Approved",
      message: `Hello,

Congratulations! Your registration has been approved.

Here are your login credentials:
Username: ${username}
Password: ${password}

Please save these credentials securely and change your password after your first login.

Best regards,
Admin Team`,
      username: username,
      password: password,
      reply_to: SENDER_EMAIL,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        blockHeadless: false,
        blockList: {
          list: [],
        },
      }
    );

    console.log("✅ EmailJS improved method successful:", response);
    return { success: true, message: `Credentials sent to ${recipientEmail}` };
  } catch (error) {
    console.error("❌ Improved EmailJS method failed:", error);
    return {
      success: false,
      message: `Failed to send email: ${error.message || "Unknown error"}`,
    };
  }
};

export const sendCredentialsEmailWithRetry = async (
  recipientEmail,
  username,
  password
) => {
  console.log("📧 Starting enhanced email retry mechanism");

  console.log("📧 Attempt 1: Fetch method");
  let result = await sendCredentialsEmailFetch(
    recipientEmail,
    username,
    password
  );
  if (result.success) {
    return result;
  }

  console.log("📧 Attempt 2: XHR method");
  result = await sendCredentialsEmailXHR(recipientEmail, username, password);
  if (result.success) {
    return result;
  }

  console.log("📧 Attempt 3: Improved EmailJS method");
  result = await sendCredentialsEmailImproved(
    recipientEmail,
    username,
    password
  );
  if (result.success) {
    return result;
  }

  console.error("❌ All email methods failed");
  return {
    success: false,
    message:
      "All email sending methods failed. Please check your network connection and try again.",
  };
};

// Status notification with retry
export const sendStatusNotificationEmail = async (
  recipientEmail,
  userName,
  status
) => {
  try {
    console.log(`📧 Sending ${status} notification to:`, recipientEmail);

    const isApproved = status === "approved";
    const subject = isApproved
      ? "Registration Approved - Welcome!"
      : "Registration Status Update";

    const message = isApproved
      ? `Dear ${userName},

Congratulations! Your registration has been approved and you are now eligible to participate in our upcoming raffle.

What's Next:
• Please monitor our raffle platform regularly for updates
• The raffle countdown will be displayed on the main dashboard
• Make sure to check back frequently as the raffle start time approaches
• You will receive your login credentials in a separate email

We appreciate your patience and look forward to your participation!

Best regards,
Admin Team`
      : `Dear ${userName},

We regret to inform you that your registration application has been rejected.

If you have any questions or would like to reapply in the future, please don't hesitate to contact us.

Thank you for your interest.

Best regards,
Admin Team`;

    const templateParams = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        from_name: SENDER_NAME,
        from_email: SENDER_EMAIL,
        to_email: recipientEmail,
        subject: subject,
        message: message,
        reply_to: SENDER_EMAIL,
      },
    };

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify(templateParams),
      }
    );

    if (response.ok) {
      console.log("✅ Status notification sent successfully");
      return {
        success: true,
        message: `Notification sent to ${recipientEmail}`,
      };
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("❌ Error sending status notification:", error);
    return {
      success: false,
      message: `Failed to send notification: ${
        error.message || "Unknown error"
      }`,
    };
  }
};

export const createCORSProxy = () => {
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

  return {
    sendWithProxy: async (recipientEmail, username, password) => {
      try {
        const templateParams = {
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            from_name: SENDER_NAME,
            from_email: SENDER_EMAIL,
            to_email: recipientEmail,
            subject: "Your Account Credentials - Registration Approved",
            message: `Hello,

Congratulations! Your registration has been approved.

Here are your login credentials:
Username: ${username}
Password: ${password}

Please save these credentials securely and change your password after your first login.

Best regards,
Admin Team`,
            username: username,
            password: password,
            reply_to: SENDER_EMAIL,
          },
        };

        const response = await fetch(
          CORS_PROXY + "https://api.emailjs.com/api/v1.0/email/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(templateParams),
          }
        );

        if (response.ok) {
          return {
            success: true,
            message: `Credentials sent to ${recipientEmail}`,
          };
        } else {
          throw new Error(`Proxy request failed: ${response.statusText}`);
        }
      } catch (error) {
        return {
          success: false,
          message: `Proxy method failed: ${error.message}`,
        };
      }
    },
  };
};
