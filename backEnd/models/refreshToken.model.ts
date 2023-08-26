import mongoose from "mongoose";
import { RefreshToken } from "../../types";

const refreshTokenSchema = new mongoose.Schema<RefreshToken>({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true,
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
        default: false,
    },
    replacedByToken: {
        type: String,
        default: null,
    }
});

const RefreshToken = mongoose.model('Refresh_token', refreshTokenSchema);
export default RefreshToken