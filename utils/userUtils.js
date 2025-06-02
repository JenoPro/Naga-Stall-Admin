// Generate a random username based on year and random digits
export const generateUsername = () => {
  const currentYear = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of current year
  const randomDigits = Math.floor(10000 + Math.random() * 90000); // Generate 5 random digits
  return `${currentYear}-${randomDigits}`;
};

// Generate a random password (3 letters + 3 numbers)
export const generatePassword = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters = Array(3).fill()
    .map(() => letters.charAt(Math.floor(Math.random() * letters.length)))
    .join('');
  
  const randomNumbers = Math.floor(100 + Math.random() * 900); // Generate 3 random digits
  return `${randomLetters}${randomNumbers}`;
};

// Sort function to order by status and date
export const sortRegistrantData = (data) => {
  // First separate data by status
  const pending = data.filter(item => !item.status || item.status === 'pending');
  const approved = data.filter(item => item.status === 'approved');
  const declined = data.filter(item => item.status === 'declined');
  
  // Sort pending items by registrationId (assuming lower ID means older record)
  const sortedPending = pending.sort((a, b) => a.registrationId - b.registrationId);
  
  // Combine all data in the desired order
  return [...sortedPending, ...approved, ...declined];
};