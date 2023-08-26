import mongoose from 'mongoose';
const { Schema } = mongoose;
import { Profession, Gender, Location, AdditionalInformation, User} from "../../types"

const ProfessionSchema = new Schema<Profession>({
  jobTitle: {type: String },
  employer: {type: String}
}, { _id : false, timestamps:false })

const GenderSchema = new Schema<Gender>({
  general: { type: String, required: true, ref:'gender' },
  specific: { type: String }
}, { _id : false });

const LocationSchema = new Schema<Location>({
  coordinates: { type: {longitude: {type: Number, required: true}, latitude: {type: Number, required: true}} },
  city: { type: String },
}, { _id : false });

const AdditionalInformationSchema = new Schema<AdditionalInformation>({
  question_id: { type: String, required: true, ref:'questions_list' },
  answer: { type: String, required: true },
}, { _id : false });

const UserSchema = new Schema<User>({
  _id: { type: String, alias: 'uid' },
  username: { type: String, required: true},
  profession: {type: ProfessionSchema},
  gender: {type: GenderSchema, required: true},
  phoneNumber: { type: String, trim: true, sparse: true, unique: true},
  email: { type: String, unique: true, sparse: true },
  location: {type: LocationSchema},
  interests: {type: [String], required: true, ref: 'interests'},
  languages: {type: [String], ref:'languages'},
  bio: {type: String},
  additionalInformation: {type: [AdditionalInformationSchema], required: true},
  height: {type: {feets: String, inches: String},    _id: false,  },
  relationshipGoal: { type: String, required: true },
  sexualOrientation: {type: [String]},
  religion: {type: [String]},
  seeking: {type: [String], required: true, ref:'gender'},
  pictures: {type: [String], required: true},
  dateOfBirth: { type: Date, required: true },
  instagram: {type: String, ref:'instagrams'},
  spotify: {type: String, ref:'spotifies'},
  covidVaccination: { type: String },
  ethnicity: { type: String },
  lastActive: { type: Date, default: Date.now }, 
  connects: { type: Number, default: 40 },
  isPremiumMember: {type: Boolean, default: false},
  verified: {type: Boolean, default: false}
},{
  timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
