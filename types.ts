export interface Image {
    height: number;
    width: number;
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
    _id: string; 
    artists: Artist[];
  }
  
  export interface InstagramDocument {
    accessToken?: string;
    _id: string;
    images: Image[];
    expiryDate?: Date;
  }
  
  export interface Profession {
    jobTitle?: string;
    employer?: string;
  }
  
  export interface Gender {
    general: 'Male' | 'Female' | 'Non-Binary';
    specific?: string;
  }
  
  export interface Location {
    coordinates: { longitude: number; latitude: number };
    city?: string;
  }
  
  export interface AdditionalInformation {
    question_id: string;
    answer: string;
  }
  
  export interface Height {
    feets: string;
    inches: string;
  }
  
  export interface User {
    _id: string;
    username: string;
    profession?: Profession;
    gender: Gender;
    phoneNumber?: string;
    email?: string;
    location?: Location;
    interests: string[];
    languages?: string[];
    bio?: string;
    additionalInformation: AdditionalInformation[];
    height?: Height;
    relationshipGoal: string;
    sexualOrientation?: string[];
    religion?: string[];
    seeking: string[];
    pictures: string[];
    dateOfBirth: Date;
    instagram?: string;
    spotify?: string;
    covidVaccination?: string;
    ethnicity?: string;
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
    _id: string;
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
    answers: {id:string, text: string}[],
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
    _id: string,
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
    category_id: string,
    icon: string
}

export interface Gender { 
    gender: string,
    extra: string[]
}

export interface Pictures { 
    user_id: string,
    url: string,
    blurLevel?: number,
}


export interface RefreshToken { 
    token: string,
    _id:string,
    issuedAt?: Date,
    expiresAt: Date,
    revoked?: Date,
    replacedByToken?: string
}