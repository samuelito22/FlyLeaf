import mongoose, {Schema} from "mongoose";

const InterestCategoriesSchema = new Schema({
    name: {
        type: String,
        required: true
    }

});

const InterestCategoriesModel = mongoose.model('interest_categories', InterestCategoriesSchema);
export default InterestCategoriesModel;