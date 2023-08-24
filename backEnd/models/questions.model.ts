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
  answers: [{id: String, text: String}],
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

const QuestionModel = mongoose.model('questions_list', questionSchema);
export default QuestionModel;