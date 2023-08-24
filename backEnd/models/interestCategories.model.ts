import mongoose, {Schema} from "mongoose";
import { InterestCategories } from "../../types";

const InterestCategoriesSchema = new Schema<InterestCategories>({
    name: {
        type: String,
        required: true
    }

});

const InterestCategoriesModel = mongoose.model('interest_categories', InterestCategoriesSchema);
export default InterestCategoriesModel;