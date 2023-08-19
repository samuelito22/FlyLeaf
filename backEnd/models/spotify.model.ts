import mongoose, { Schema, Document, Model } from 'mongoose';
import {Artist, SpotifyDocument} from "../../SpotifyDocument"

interface SpotifyModel extends Model<SpotifyDocument> {}

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
    _id: { type: String, alias: 'spotify_id' },
    artists: [ArtistSchema]
});

const SpotifyModel: SpotifyModel = mongoose.model<SpotifyDocument, SpotifyModel>('Spotify', SpotifySchema);

export default SpotifyModel;
