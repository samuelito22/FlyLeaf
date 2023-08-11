import mongoose from 'mongoose';
const { Schema } = mongoose;

const ArtistSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    uri: { type: String, required: true },
    href: { type: String, required: true },
    images: [{
        height: Number,
        width: Number,
        url: String
    }],
    genres: [{ type: String }]
}, { _id: false });

const SpotifySchema = new Schema({
    refreshToken: { type: String, required: true },
    _id: { type: String, alias: 'spotify_id' },
    artists: [ArtistSchema] 
});

export default mongoose.model('Spotify', SpotifySchema);
