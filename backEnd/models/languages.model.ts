import mongoose, {Schema} from "mongoose";

const languagesSchema = new Schema({
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