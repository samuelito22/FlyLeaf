import mongoose, {Schema} from "mongoose";
import { Questions } from "../../types";

const questionSchema = new Schema<Questions>({
  question: {
    type: String,
    required: true,
  },
  shortForm: {
    type: String,
    required: true,
  },
  answers: [Schema.Types.ObjectId],
  icon: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Basic', 'Advanced'],
    required: true,
  }
});

const QuestionModel = mongoose.model('questions', questionSchema);
export default QuestionModel;