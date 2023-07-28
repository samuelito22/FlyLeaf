import mongoose from 'mongoose';
const { Schema } = mongoose;

const LocationSchema = new Schema({
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number] },
  city: { type: String },
  country: { type: String },
  showLocation: {type: Boolean, default: false},
  showDistance: {type: Boolean, default: true}
}, { _id : false });

const AdditionalInformationSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  icon: {type: String, required: true}
}, { _id : false });

const GenderSchema = new Schema({
  general: { type: String, required: true, enum: ['Male', 'Female', 'Non-Binary'] },
  specific: { type: String }
}, { _id : false });

const UserSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  profile: {
    firstName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: GenderSchema, required: true },
    jobTitle: {type: String},
    company: {type: String},
    bio: { type: String, default: "Hello! I'm new here and haven't written my bio yet. Check my profile!" },
    height: {type: {feet: Number, inches: Number}},
    pictures: [{ type: String }],
  },
  preferences: {
    genderPreferences: { type: [String], required: true },
    relationshipGoal: { type: String, required: true, enum: ['Relationship', 'Friendship', 'Exploring'] },
    sexualOrientation: {type: [String]},
  },
  contact: {
    phoneNumber: { type: String, trim: true, sparse: true, unique: true },
    email: { type: String, unique: true, sparse: true },
  },
  interests: {
    interests: { type: [String], required: true },
    languages: {type: [String]},
    additionalInformation: { type: [AdditionalInformationSchema], required: true },
    dailyThoughts:{ type: String }
  },
  location: {
    lastLocation: { type: LocationSchema },
    distanceFromUsers: { type: Schema.Types.Mixed, default: 10, enum: [5, ...Array(46).fill(null).map((_, i) => i + 5), "local", "global"] },
  },
  appActivity: {
    createdAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now }, 
    likedProfiles: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
    isPremiumUser: { type: Boolean, default: false }, 
    connects: { type: Number, default: 40 },
  },
  visibilityStatus: { type: String, enum: ['Public', 'Private', 'Matches Only'], default: 'Public' }, 
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
