import mongoose, { Schema, Document, Model } from 'mongoose';
import { Image, InstagramDocument } from "../../types"

interface InstagramModel extends Model<InstagramDocument> {}

const ImageSchema = new Schema<Image>({
    id: { type: String, required: true }, 
    url: { type: String, required: true },                      
}, { _id: false });

const InstagramSchema = new Schema<InstagramDocument>({
    accessToken: { type: String, required: true },
    _id: { type: String, alias: 'instagram_id', required: true },
    images: [ImageSchema],
    expiryDate: { type: Date, required: true }
});

const InstagramModel: InstagramModel = mongoose.model<InstagramDocument, InstagramModel>('instagrams', InstagramSchema);

export default InstagramModel;
