import mongoose from "mongoose";
import { EmailTokenSchema } from "../../types";  // Define your own EmailTokenSchema interface

const emailTokenSchema = new mongoose.Schema<EmailTokenSchema>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900,  // this is the TTL (Time To Live) in seconds, 15 minutes
  },
});

const EmailTokenModel = mongoose.model('EmailToken', emailTokenSchema);

export default EmailTokenModel;
