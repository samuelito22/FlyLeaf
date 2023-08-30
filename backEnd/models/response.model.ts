import mongoose, {Schema} from "mongoose";

const ResponseSchema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  answerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const UserResponseSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: 'User', alias:'userId' },

  responses: {
    type: [ResponseSchema],
    default: [],
  },
}, {timestamps: true});

const UserResponse = mongoose.models.UserResponse || mongoose.model('UserResponse', UserResponseSchema);

export default UserResponse