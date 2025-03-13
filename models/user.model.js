import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username already exists"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  forgotPasswrdToken: String,
  forgotPasswrdExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;
