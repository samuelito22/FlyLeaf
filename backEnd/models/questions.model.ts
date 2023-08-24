import mongoose, {Schema} from "mongoose";

const questionSchema = new Schema({
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