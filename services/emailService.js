import { Alert } from 'react-native';
import emailjs from '@emailjs/browser';

// Email configuration
const EMAILJS_SERVICE_ID = 'service_e2awvdk';
const EMAILJS_TEMPLATE_ID = 'template_r6kxcnh';
const SENDER_EMAIL = 'requiem121701@gmail.com';
const SENDER_NAME = 'Juggernaut Exe';

// Send email with credentials automatically
export const sendAutomatedEmail = async (recipientEmail, username, password, setEmailSending) => {
  if (setEmailSending) setEmailSending(true);
  
  try {
    const templateParams = {
      from_name: SENDER_NAME,
      from_email: SENDER_EMAIL,
      to_email: recipientEmail,
      subject: 'Your Account Credentials',
      message: `Hello,\n\nYour account has been approved. Here are your login credentials:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease change your password after your first login.\n\nBest regards,\nAdmin Team`
    };
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );
    
    console.log('✅ Email sent successfully:', response);
    Alert.alert('Success', `Credentials sent to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.log('❌ Error sending email:', error);
    Alert.alert('Email Error', `Failed to send credentials: ${error.message}`);
    return false;
  } finally {
    if (setEmailSending) setEmailSending(false);
  }
};