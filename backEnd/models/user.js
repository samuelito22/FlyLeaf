import mongoose from 'mongoose';
const { Schema } = mongoose;

const LocationSchema = new Schema({
  type: { type: String, enum: ['Point'] },
  coordinates: { type: [Number] },
  city: { type: String },
  country: { type: String }
}, { _id : false });

const QuestionAndAnswerSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id : false });

const GenderSchema = new Schema({
  general: { type: String, required: true, enum: ['Male', 'Female', 'Non-Binary'] },
  specif: { type: String, required: false }
}, { _id : false });

const UserSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: GenderSchema, required: true },
  genderPreferences: { type: [String], required: true },
  pictures: [{ type: String }],
  relationshipGoal: { type: String, required: true, enum: ['Relationship', 'Friendship', 'Exploring'] },
  phoneNumber: { type: String, trim: true, sparse: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now },
  lastLocation: { type: LocationSchema, required: false },
  questionAndAnswer: { type: [QuestionAndAnswerSchema], required: true },
  interests: { type: [String], required: true },
  distanceFromUsers: { type: Schema.Types.Mixed, default: 10, enum: [5, 10, 15, 20, "local", "global"] },
  likedProfiles: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
  blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
  isPremiumUser: { type: Boolean, default: false }, 
  lastActive: { type: Date, default: Date.now }, 
  visibilityStatus: { type: String, enum: ['Public', 'Private', 'Matches Only'], default: 'Public' }, 
  bio: { type: String, default: "Hello! I'm new here and haven't written my bio yet. Check my profile!" },
  credits: { type: Number, default: 0 },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
