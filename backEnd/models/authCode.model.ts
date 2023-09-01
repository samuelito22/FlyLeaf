import mongoose from "mongoose";

const authCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,  
  },
});


const AuthCodeModel = mongoose.model('AuthCode', authCodeSchema);

export default AuthCodeModel;
