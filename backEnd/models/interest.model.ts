import mongoose, {Schema} from "mongoose";

const InterestsSchema = new Schema({
    category_id: {
        type: String,
        required: true
    },
    icon: {
        type: String, 
        required: true,
    },
    name: {
        type: String,
        required: true
    }

});

const InterestsModel = mongoose.model('interests', InterestsSchema);
export default InterestsModel;