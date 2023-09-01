import mongoose from "mongoose";
import { OTPSchema } from "../../types";

const otpSchema = new mongoose.Schema<OTPSchema>({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900, // this is the TTL (Time To Live) in seconds, 15 minutes
  },

});

const OTPModel = mongoose.model('OTP', otpSchema);

export default OTPModel