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

export interface Image {
    id: string;
    url: string;
}

export interface InstagramDocument {
    accessToken?: string;
    _id: string;
    images: Image[];
    expiryDate?: Date;
}

export interface Profession {
    jobTitle?: string,
    employer?: string
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