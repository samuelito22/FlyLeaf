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
}

