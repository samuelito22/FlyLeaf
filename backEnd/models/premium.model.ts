import mongoose, {Schema} from "mongoose";
import { Premium } from "../../types";

const PremiumSchema = new Schema<Premium>({
    _id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' // Assuming you have a User model
    },
    startDate: { 
        type: Date, 
        default: Date.now 
    },
    endDate: { 
        type: Date,
        required: true
    },
    planType: {
        type: String,
        enum: ['MONTHLY', 'YEARLY'],
        required: true
    },
    autoRenew: {
        type: Boolean,
        default: true
    },
    features: {
        unlimitedSwipes: {
            type: Boolean,
            default: true
        },
        noAds: {
            type: Boolean,
            default: true
        },
        advancedFiltering: {
            type: Boolean,
            default: true
        },
        readReceipts: {
            type: Boolean,
            default: true
        },
        priorityProfile: {
            type: Boolean,
            default: true
        },
        incognitoBrowsing: {
            type: Boolean,
            default: false
        },
        fasterDebluring: {
            type: Boolean,
            default: false
        }
        
        
        
        
        // Add other premium features here
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['CREDIT_CARD', 'PAYPAL', 'OTHER'] 
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['PAID', 'PENDING', 'FAILED']
    },
    cancellationRequested: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const PremiumModel = mongoose.model('Premium', PremiumSchema);
export default PremiumModel;
