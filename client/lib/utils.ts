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

export type AvatarKey = "10" | "20" |  "30" | "40" | "50" | "60" | "70" | "80" | "90" | "100";


// Create a function that maps a string input to a corresponding image
export const getImageForValue = (value: AvatarKey) => {
  const images = {
   
    "10": require('../assets/avatars/User 01a.png'),
    "20": require('../assets/avatars/User 01b.png'),
    "30": require('../assets/avatars/User 01c.png'),
    "40": require('../assets/avatars/User 02a.png'),
    "50": require('../assets/avatars/User 02b.png'),
    "60": require('../assets/avatars/User 02c.png'),
    "70": require('../assets/avatars/User 03a.png'),
    "80": require('../assets/avatars/User 03b.png'),
    "90": require('../assets/avatars/User 03c.png'),
    "100": require('../assets/avatars/User 04a.png'),
 
    // Add more mappings as needed
  };

  // Return the corresponding image or a default image if value doesn't match
  return images[value] || require('../assets/avatars/User 01a.png');
};