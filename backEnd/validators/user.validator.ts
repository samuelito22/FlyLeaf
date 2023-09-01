import Joi from 'joi';
import { objectIdRegex } from '../constants/regex';

export const userProfileValidationSchema = Joi.object({
  profession: Joi.object({
    jobTitle: Joi.string().optional(),
    employer: Joi.string().optional(),
  }).optional(),
  gender: Joi.object({
    primary: Joi.string().required(),
    secondary: Joi.string().optional(),
  }).optional(),
  location: Joi.object({
    city: Joi.string().optional(),
  }).optional(),
  interests: Joi.array().items(Joi.string().pattern(objectIdRegex)).max(5).optional(),
  languages: Joi.array().items(Joi.string().pattern(objectIdRegex)).max(5).optional(),
  bio: Joi.string().optional(),
  height: Joi.object({
    feets: Joi.string().optional(),
    inches: Joi.string().optional(),
  }).optional(),
  relationshipGoal: Joi.string().pattern(objectIdRegex).optional(),
  seeking: Joi.array().items(Joi.string().pattern(objectIdRegex)).max(3).optional(),
  
})

const settingsSchema = Joi.object({
    distanceInKm: Joi.boolean(),
    notification: Joi.object({
      emailNotifications: Joi.boolean(),
      newMessageNotification: Joi.boolean(),
      newMatchNotification: Joi.boolean(),
      pushNotifications: Joi.boolean()
    }),
    safety: Joi.object({
      blockList: Joi.array().items(Joi.string()),
      reportList: Joi.array().items(Joi.string())
    }),
    filter: Joi.object({
      preferredRelationshipGoal: Joi.string().valid('Friendship', 'Relationship', 'Exploring', 'All'),
      ageMax: Joi.number().max(120),
      ageMin: Joi.number().min(18),
      global: Joi.boolean(),
      distanceRadius: Joi.number().valid(...Array.from({ length: 101 }, (_, i) => i)),
      showProfilesWithPhotos: Joi.number().valid(...Array.from({ length: 7 }, (_, i) => i)),
      showVerifiedProfilesOnly: Joi.boolean()
    }),
    privacy: Joi.object({
      showOnlineStatus: Joi.boolean(),
      showLastActive: Joi.boolean()
    }),
    account: Joi.object({
      deactivateAccountAfterInactivity: Joi.array().items(Joi.number().valid(-1, ...Array.from({ length: 365 }, (_, i) => i))),
      discoverable: Joi.boolean()
    })
  });
  
  // Validation schema for the premium object
  const premiumSchema = Joi.object({
    startDate: Joi.date(),
    endDate: Joi.date().required(),
    planType: Joi.string().valid('MONTHLY', 'YEARLY').required(),
    autoRenew: Joi.boolean(),
    features: Joi.object({
      unlimitedSwipes: Joi.boolean(),
      noAds: Joi.boolean(),
      advancedFiltering: Joi.boolean(),
      readReceipts: Joi.boolean(),
      priorityProfile: Joi.boolean(),
      incognitoBrowsing: Joi.boolean(),
      fasterDebluring: Joi.boolean()
    }),
    paymentMethod: Joi.string().valid('CREDIT_CARD', 'PAYPAL', 'OTHER').required(),
    paymentStatus: Joi.string().valid('PAID', 'PENDING', 'FAILED').required(),
    cancellationRequested: Joi.boolean()
  });
  
  // Combined validation schema
export const combinedSettingsAndPremiumSchema = Joi.object({
    settings: settingsSchema,
    premium: premiumSchema.optional()
  });



