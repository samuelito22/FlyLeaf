import mongoose, {Schema} from "mongoose";
import { Interest } from "../../types";

const InterestsSchema = new Schema<Interest>({
    category_id: {
        type: Schema.Types.ObjectId,
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