import mongoose, { Document, Schema } from "mongoose";

// Define the UserDocument interface
interface UserDocument extends Document {
  username: string;
  password: string; // Store hashed password
  email: string;
  role: "admin" | "customer"; // Define user roles
  ordersHistory: [];
  phoneNumber: string;
  systemAvatar:
    | "10"
    | "20"
    | "30"
    | "40"
    | "50"
    | "60"
    | "70"
    | "80"
    | "90"
    | "100";
  likedMenuItems?: string[];
}

// Predefined avatar values
const avatarOptions: UserDocument["systemAvatar"][] = [
  "10",
  "20",
  "30",
  "40",
  "50",
  "60",
  "70",
  "80",
  "90",
  "100",
];

// Helper function to randomly select a predefined avatar
const generateRandomAvatar = (): UserDocument["systemAvatar"] => {
  const randomIndex = Math.floor(Math.random() * avatarOptions.length);
  return avatarOptions[randomIndex];
};

// Define the User schema
const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: false },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    systemAvatar: { type: String, enum: avatarOptions }, // Predefined avatar values
    likedMenuItems: [{ type: Schema.Types.ObjectId, ref: "MenuItem" }],
  },
  { timestamps: true }
);

// Pre-save hook to assign a random avatar if not provided
UserSchema.pre("save", function (next) {
  if (!this.systemAvatar) {
    this.systemAvatar = generateRandomAvatar();
  }
  next();
});

// Export the User model
export default mongoose.model<UserDocument>("User", UserSchema);
