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
