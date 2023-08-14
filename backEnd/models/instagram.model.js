import mongoose from 'mongoose';
const { Schema } = mongoose;

const ImageSchema = new Schema({
    id: { type: String, required: true }, 
    url: { type: String, required: true },
    width: Number,                       
    height: Number                        
}, { _id: false });

const InstagramSchema = new Schema({
    accessToken: { type: String, required: true },
    _id: { type: String, alias: 'instagram_id', required: true},
    images: [ImageSchema] ,
    expiryDate: {type: Date, required: true}
});

export default mongoose.model('Instagram', InstagramSchema);
