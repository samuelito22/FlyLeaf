import mongoose, {Schema} from "mongoose";

const NotificationSchema = new Schema({
    emailNotifications: {type: Boolean, default: true},
    newMessageNotification: {type: Boolean, default: true},
    newMatchNotification: {type: Boolean, default: true},
    pushNotifications:  {type: Boolean, default: true},
}, {_id:false})

const SafetySchema = new Schema({
    blockList: {type: [String], default: []},
    reportList: {type: [String], default: []},
}, {_id:false})

const FilterSchema = new Schema({
    preferredRelationshipGoal: {type: String, enum: ['Friendship', 'Relationship', 'Exploring', 'All']},
  seeking: {type: [String]},
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
})

const PrivacySchema = new Schema({
    showOnlineStatus: {type: Boolean, default: true},
  showLastActive: {type: Boolean, default: true},
})

const AccountSchema = new Schema({
    deactivateAccountAfterInactivity: {type: [Number], enum: [-1, ...Array.from({ length: 7 }, (_, i) => i)] },
    discoverable: {type: Boolean, default: true}

})

const SettingsSchema = new Schema({
    _id: { type: String, required: true, unique: true ,ref: 'User' },
    
  distanceInKm: {type: Boolean, default: false},
  
  notification: {type:NotificationSchema},
    safety: {type: SafetySchema},
  filter: {type: FilterSchema},
  privacy: {type: PrivacySchema},  
  account: {type: AccountSchema}
});

const SettingsModel = mongoose.model('Settings', SettingsSchema);
export default SettingsModel;