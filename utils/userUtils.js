export const generateUsername = () => {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `${currentYear}-${randomDigits}`;
};

export const generatePassword = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = Array(3)
    .fill()
    .map(() => letters.charAt(Math.floor(Math.random() * letters.length)))
    .join("");

  const randomNumbers = Math.floor(100 + Math.random() * 900);
  return `${randomLetters}${randomNumbers}`;
};

export const sortRegistrantData = (data) => {
  const pending = data.filter(
    (item) => !item.status || item.status === "pending"
  );
  const approved = data.filter((item) => item.status === "approved");
  const declined = data.filter((item) => item.status === "declined");

  const sortedPending = pending.sort(
    (a, b) => a.registrationId - b.registrationId
  );

  return [...sortedPending, ...approved, ...declined];
};
