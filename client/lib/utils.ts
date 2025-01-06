export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Helper function to validate email format
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate phone number format
export const isValidPhoneNumber = (phone: string) => {
  const phoneRegex = /^[0-9]{10,15}$/; // Allows numbers with 10 to 15 digits
  return phoneRegex.test(phone);
};
