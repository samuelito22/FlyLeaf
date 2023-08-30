import mongoose, {Schema} from "mongoose";
import { Gender } from "../../types";

const genderSchema = new Schema<Gender>({
    primary: {
        type: String, 
        required: true,
    },
    secondary: {
        type: [{text: String}],
        required: true
    }

});

const GenderModel = mongoose.models.gender || mongoose.model('genders', genderSchema);
export default GenderModel;