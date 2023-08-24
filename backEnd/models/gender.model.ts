import mongoose, {Schema} from "mongoose";

const genderSchema = new Schema({
    gender: {
        type: String, 
        required: true,
    },
    extra: {
        type: [String],
        required: true
    }

});

const GenderModel = mongoose.model('gender', genderSchema);
export default GenderModel;