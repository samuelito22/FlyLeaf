import mongoose, {Schema} from "mongoose";
import { Notification, Safety, Filter, Privacy, Account,  Settings} from "../../types"

const NotificationSchema = new Schema<Notification>({
    emailNotifications: {type: Boolean, default: true},
    newMessageNotification: {type: Boolean, default: true},
    newMatchNotification: {type: Boolean, default: true},
    pushNotifications:  {type: Boolean, default: true},
}, {_id:false})

const SafetySchema = new Schema<Safety>({
    blockList: {type: [String], default: []},
    reportList: {type: [String], default: []},
}, {_id:false})

const FilterSchema = new Schema<Filter>({
    preferredRelationshipGoal: {type: String, enum: ['Friendship', 'Relationship', 'Exploring', 'All']},
  ageMax: {
    type: Number,
    default: 100,
    max: [120, 'Age cannot be more than 120.']
  },
  ageMin: {
    type: Number,
    default: 18,
    max: [18, 'Age cannot be more than 120.']
  },
  global: {type: Boolean, default: false},
  distanceRadius: {type: Number, default: 50, enum:Array.from({ length: 101 }, (_, i) => i)},
  showProfilesWithPhotos: {type: Number, default: 2, enum:Array.from({ length: 7 }, (_, i) => i)},
  showVerifiedProfilesOnly: {type: Boolean, default: false},
}, {_id:false})

const PrivacySchema = new Schema<Privacy>({
    showOnlineStatus: {type: Boolean, default: true},
  showLastActive: {type: Boolean, default: true},
}, {_id:false})

const AccountSchema = new Schema<Account>({
    deactivateAccountAfterInactivity: {type: [Number], enum: [-1, ...Array.from({ length: 365 }, (_, i) => i)], default: 30 },
    discoverable: {type: Boolean, default: true}

}, {_id:false})

const SettingsSchema = new Schema<Settings>({
    _id: { type: Schema.Types.ObjectId, ref: 'User' },
    
  distanceInKm: {type: Boolean, default: false},
  
  notification: {type:NotificationSchema, default:{}},
    safety: {type: SafetySchema, default:{}},
  filter: {type: FilterSchema,  default:{}},
  privacy: {type: PrivacySchema,  default:{}},  
  account: {type: AccountSchema, default:{}}
});

const SettingsModel = mongoose.model('Settings', SettingsSchema);
export default SettingsModel;