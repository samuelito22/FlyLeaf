import mongoose from "mongoose";

let User;

try {
  User = mongoose.model("users");
} catch {
  const userSchema = new mongoose.Schema({
    uid: {
      type: String,
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    genderPreferences: {
      type: [String],
      required: true,
    },
    pictures: [{
      type: [String],
      required: false
    }],
    relationshipGoal: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
      required: false
    },
    email: {
      type: String,
      unique: true,
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLocation: {
      type: {
        type: String,
        enum: ['Point'], 
        required: false
      },
      coordinates: {
        type: [Number],
        required: false
      },
      city: {
        type: String,
        required: false
      }
    },
    questionAndAnswer: [{
      question: { type: String, required: true },
      answer: { type: String, required: true }
    },],
    interests: {
      type: [String],
      required: true
    }
    
  });

  User = mongoose.model("users", userSchema);
}

export { User };
