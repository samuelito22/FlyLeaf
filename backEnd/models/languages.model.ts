import mongoose, {Schema} from "mongoose";
import { Languages } from "../../types";

const languagesSchema = new Schema<Languages>({
    code: {
        type: String, 
        required: true,
    },
    name: {
        type: String,
        required: true
    }

});

const LanguagesModel = mongoose.model('languages', languagesSchema);
export default LanguagesModel;