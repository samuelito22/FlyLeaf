import mongoose, { Schema, Document, Model } from 'mongoose';
import {Artist, SpotifyDocument} from "../../types"

const ObjectId =  mongoose.Types.ObjectId

const ArtistSchema = new Schema<Artist>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    images: [{
        height: Number,
        width: Number,
        url: String
    }],
    genres: [{ type: String }]
}, { _id: false });

const SpotifySchema = new Schema<SpotifyDocument>({
    refreshToken: { type: String, required: true },
    _id: { type: ObjectId, alias: 'spotify_id' },
    artists: [ArtistSchema]
});

const SpotifyModel = mongoose.model('spotifies', SpotifySchema);

export default SpotifyModel;
