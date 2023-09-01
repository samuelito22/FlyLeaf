import mongoose from 'mongoose';
import {
    COLLECT_USER_ADDITIONAL_INFORMATION, COLLECT_USER_GENDER, 
    COLLECT_USER_INSTAGRAM, 
    COLLECT_USER_INTERESTS, COLLECT_USER_LANGUAGES, COLLECT_USER_PICTURES, 
    COLLECT_USER_PREMIUM_FEATURES, COLLECT_USER_SEEKING, COLLECT_USER_SETTINGS, 
    COLLECT_USER_SPOTIFY
  } from './aggregate.utils';
  
  export const buildUserProfilePipeline = (userId: mongoose.Types.ObjectId, user: any, isSelf: boolean) => {
    const pipeline = [
      { $match: { _id: userId } },
      ...COLLECT_USER_PICTURES,
      ...COLLECT_USER_SEEKING,  
      ...COLLECT_USER_INTERESTS ,
      ...COLLECT_USER_GENDER   ,
      ...COLLECT_USER_SETTINGS,
      ...COLLECT_USER_ADDITIONAL_INFORMATION,
    ];

  
    if (user.languages && user.languages.length > 0) pipeline.push(...COLLECT_USER_LANGUAGES as any);
    if (user.spotify) pipeline.push(...COLLECT_USER_SPOTIFY as any);
    if (user.instagram) pipeline.push(...COLLECT_USER_INSTAGRAM as any);
    if (user.isPremiumMember && isSelf) pipeline.push(...COLLECT_USER_PREMIUM_FEATURES as any); // Only for self
  
    if (!isSelf) {
      pipeline.push({
        $project: {
          phoneNumber: 0,
          isPremiumMember: 0,
          connects: 0,
          email: 0,
          createdAt: 0,
          updatedAt: 0,
        }
      } as any);
    }
  
    return pipeline;
  };
  