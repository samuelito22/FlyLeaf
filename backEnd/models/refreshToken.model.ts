import mongoose from "mongoose";
import { RefreshToken } from "../../types";

const refreshTokenSchema = new mongoose.Schema<RefreshToken>({
    _id: { type: String, ref: 'User', required: true },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    issuedAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    revoked: {
        type: Date,
        default: null,
    },
    replacedByToken: {
        type: String,
        default: null,
    }
});

const RefreshToken = mongoose.model('Refresh_token', refreshTokenSchema);
export default RefreshToken