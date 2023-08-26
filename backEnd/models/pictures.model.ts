import mongoose, {Schema} from "mongoose";
import { Pictures } from "../../types";

const PicturesSchema = new Schema<Pictures>({
  user_id: {
    type: String,
    required: true,
    ref: 'User',
  },
  _id: { type: String },
  url: {
    type: String,
    required: true,
  },
  blurLevel: {
    type: Number,
    default: 0.75,
    min: 0,
    max: 1,
  },
});

const PicturesModel = mongoose.model('pictures', PicturesSchema);
export default PicturesModel;