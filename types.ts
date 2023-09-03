import {Schema} from "mongoose";

export interface Image {
    id:Schema.Types.ObjectId;
    url: string;
  }
  
  export interface Artist {
    id: string;
    name: string;
    type: string;
    images: Image[];
    genres: string[];
  }
  
  export interface SpotifyDocument {
    refreshToken?: string;
    _id: Schema.Types.ObjectId; 
    artists: Artist[];
  }
  
  export interface InstagramDocument {
    accessToken?: string;
    _id: Schema.Types.ObjectId;
    images: Image[];
    expiryDate?: Date;
  }
  
  export interface Profession {
    jobTitle?: string;
    employer?: string;
  }
  
  export interface Gender {
    primary: Schema.Types.ObjectId;
    secondary?: Schema.Types.ObjectId;
  }
  
  export interface Location {
    coordinates: { longitude: number; latitude: number };
    city?: string;
  }
  
  export interface AdditionalInformation {
    question_id: Schema.Types.ObjectId;
    answer: Schema.Types.ObjectId;
  }
  
  export interface Height {
    feets: string;
    inches: string;
  }
  
  export interface User {
    _id: Schema.Types.ObjectId;
    username: string;
    profession?: Profession;
    gender: Gender;
    phoneNumber?: string;
    email?: string;
    location?: Location;
    interests: Schema.Types.ObjectId[];
    languages?: Schema.Types.ObjectId[];
    bio?: string;
    additionalInformation: AdditionalInformation[];
    height?: Height;
    relationshipGoal: Schema.Types.ObjectId;
    sexualOrientation?: Schema.Types.ObjectId[];
    religion?: Schema.Types.ObjectId[];
    seeking: Schema.Types.ObjectId[];
    pictures: Schema.Types.ObjectId[];
    dateOfBirth: Date;
    instagram?: Schema.Types.ObjectId;
    spotify?: Schema.Types.ObjectId;
    covidVaccination?: Schema.Types.ObjectId;
    ethnicity?: Schema.Types.ObjectId;
    lastActive?: Date;
    connects?: number;
    isPremiumMember?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    verified?: boolean
  }
  
  export interface Notification {
    emailNotifications?: boolean;
    newMessageNotification?: boolean;
    newMatchNotification?: boolean;
    pushNotifications?: boolean;
}

export interface Safety {
    blockList?: string[];
    reportList?: string[];
}

export interface Filter {
    preferredRelationshipGoal?: 'Friendship' | 'Relationship' | 'Exploring' | 'All';
    seeking?: string[];
    ageMax?: number;
    ageMin?: number;
    global?: boolean;
    distanceRadius?: number;
    showProfilesWithPhotos?: number;
    showVerifiedProfilesOnly?: boolean;
}

export interface Privacy {
    showOnlineStatus?: boolean;
    showLastActive?: boolean;
}

export interface Account {
    deactivateAccountAfterInactivity?: number[];
    discoverable?: boolean;
}

export interface Settings {
    _id: Schema.Types.ObjectId;
    distanceInKm?: boolean;
    notification?: Notification;
    safety?: Safety;
    filter?: Filter;
    privacy?: Privacy;
    account?: Account;
}

export interface Questions { 
    question: string,
    shortForm: string, 
    answers: {id:Schema.Types.ObjectId, text: string}[],
    icon: string,
    type: 'Basic' | 'Advanced'
}

export interface PremiumFeatures {
    unlimitedSwipes?: boolean;
    noAds?: boolean;
    advancedFiltering?: boolean;
    readReceipts?: boolean;
    priorityProfile?: boolean;
    incognitoBrowsing?: boolean;
    fasterDebluring?: boolean;
    // Other premium features can be added here as well
}

export interface Premium {
    _id: Schema.Types.ObjectId,
    startDate?: Date;
    endDate: Date;
    planType: 'MONTHLY' | 'YEARLY';
    autoRenew?: boolean;
    features: PremiumFeatures;
    paymentMethod: 'CREDIT_CARD' | 'PAYPAL' | 'OTHER';
    paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
    cancellationRequested?: boolean;
    createdAt?: Date; 
    updatedAt?: Date;
}

export interface InterestCategories {
    name: string
}

export interface Languages {
    name: string,
    code: string
}

export interface Interest { 
    name: string, 
    category_id: Schema.Types.ObjectId,
    icon: string
}

export interface Gender { 
    gender: string,
    extra: string[]
}

export interface Pictures { 
    user_id: Schema.Types.ObjectId,
    name: string,
    blurLevel?: number,
}


export interface RefreshToken { 
    token: string,
    _id:Schema.Types.ObjectId,
    issuedAt?: Date,
    expiresAt: Date,
    revoked?: Date,
    replacedByToken?: string
}

export interface jwtPayload {
  sub: string,
  type: string
}

export interface OTPSchema {
  _id: Schema.Types.ObjectId
  phoneNumber: string;
  otp: string;
  used: boolean;
  createdAt: Date;
}

export interface EmailTokenSchema {
  email: string;
  token: string;
  createdAt?: Date;
}
