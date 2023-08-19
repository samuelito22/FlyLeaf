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
