import mongoose, {Schema} from "mongoose";
import { Gender } from "../../types";

const genderSchema = new Schema<Gender>({
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