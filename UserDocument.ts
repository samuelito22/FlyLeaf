export interface GenderSchema {
    general: 'Male' | 'Female' | 'Non-Binary';
    specific?: string;
  }
  
  export interface SpotifySchema {
    isConnected: boolean;
    spotify_id?: string;
  }
  
  export interface InstagramSchema {
    isConnected: boolean;
    instagram_id?: string;
  }
  
  export interface AdditionalInformationSchema {
    question: string;
    answer: string;
    icon: number;
  }
  
  export interface LocationSchema {
    type: 'Point';
    coordinates: { longitude: number; latitude: number };
    city?: string;
    showLocation?: boolean;
    showDistance?: boolean;
  }
  
  export interface UserDocument {
    _id: string;
    profile: {
      firstName: string;
      dateOfBirth: Date;
      gender: GenderSchema;
      jobTitle?: string;
      company?: string;
      bio: string;
      height?: { feets: string; inches: string };
      pictures: string[];
      spotify?: SpotifySchema;
      instagram?: InstagramSchema;
    };
    preferences: {
      genderPreferences: string[];
      relationshipGoal: 'Relationship' | 'Friendship' | 'Exploring';
      sexualOrientation?: string[];
    };
    contact: {
      phoneNumber?: string;
      email?: string;
    };
    interests: {
      interests: string[];
      languages?: string[];
      additionalInformation: AdditionalInformationSchema[];
      dailyThoughts?: string;
      covidVaccination?: 'Fully Vaccinated' | 'Partially Vaccinated' | 'Not Vaccinated';
      ethnicity?: 'Asian' | 'Black' | 'Mixed' | 'White' | 'Other';
    };
    location: {
      lastLocation?: LocationSchema;
      distanceFromUsers?: any; // Use 'any' type or a custom type for your use case
    };
    appActivity: {
      lastActive?: Date;
      likedProfiles: string[]; // Use 'string' type or a custom type for your use case
      blockedUsers: string[]; // Use 'string' type or a custom type for your use case
      isPremiumUser: boolean;
      connects: number;
    };
    visibilityStatus: 'Public' | 'Private' | 'Matches Only';
    createdAt: Date;
    updatedAt: Date;
  }
  
  export default UserDocument