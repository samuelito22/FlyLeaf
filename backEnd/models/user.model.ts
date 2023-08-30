import mongoose from 'mongoose';
const { Schema } = mongoose;
import { Profession, Gender, Location, AdditionalInformation, User} from "../../types"
import QuestionModel from './questions.model';
import GenderModel from './gender.model';
const ObjectId =  Schema.Types.ObjectId

const ProfessionSchema = new Schema<Profession>({
  jobTitle: {type: String },
  employer: {type: String}
}, { _id : false, timestamps:false })

const GenderSchema = new Schema<Gender>({
  primary: { type:  ObjectId, required: true, ref:GenderModel},
  secondary: { type: ObjectId, ref: GenderModel }
}, { _id : false });

const LocationSchema = new Schema<Location>({
  coordinates: { type: {longitude: {type: Number, required: true}, latitude: {type: Number, required: true}} },
  city: { type: String },
}, { _id : false });

const UserSchema = new Schema<User>({
  _id: { type: ObjectId, alias: 'uid' },
  username: { type: String, required: true},
  profession: {type: ProfessionSchema},
  gender: {type: GenderSchema, required: true},
  phoneNumber: { type: String, trim: true, sparse: true, unique: true},
  email: { type: String, unique: true, sparse: true },
  location: {type: LocationSchema},
  interests: {type: [ ObjectId], required: true, ref: 'interests'},
  languages: {type: [ ObjectId], ref:'languages'},
  bio: {type: String},
  height: {type: {feets: String, inches: String},    _id: false,  },
  relationshipGoal: { type:  ObjectId, required: true, ref: QuestionModel },
  seeking: {type: [ ObjectId], required: true, ref:GenderModel},
  pictures: {type: [ ObjectId], required: true, ref:'pictures'},
  dateOfBirth: { type: Date, required: true },
  instagram: {type:  ObjectId, ref:'instagrams'},
  spotify: {type: ObjectId, ref:'spotifies'},
  lastActive: { type: Date, default: Date.now }, 
  connects: { type: Number, default: 40 },
  isPremiumMember: {type: Boolean, default: false},
  verified: {type: Boolean, default: false}
},{
  timestamps: true
});

const UserModel = mongoose.models.users || mongoose.model("users", UserSchema);

export default UserModel;
