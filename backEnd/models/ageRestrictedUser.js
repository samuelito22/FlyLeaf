import mongoose from 'mongoose';
const { Schema } = mongoose;

const AgeRestrictedUserSchema = new Schema({
    dateOfBirth: { type: Date, required: true },
    uid: { type: String, required: true, unique: true },
    blockTimestamp: {type: Date, default: Date.now}
})

const AgeRestrictedUser = mongoose.model("AgeRestrictedUser", AgeRestrictedUserSchema);

export default AgeRestrictedUser