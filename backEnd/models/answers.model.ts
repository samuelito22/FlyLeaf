import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
}, {timestamps:true});

const Answer = mongoose.models.Answers || mongoose.model('Answers', answerSchema);
export default Answer