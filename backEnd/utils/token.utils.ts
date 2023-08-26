import  jwt  from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "../config/config";
import { jwtPayload } from "../../types";

export function createAccessToken(_id: string) {
    const payload = {
        sub: _id,  
        type: 'ACCESS', 
    };

    // The token will expire in 1 day (24 hours)
    if(ACCESS_SECRET) return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

export function createRefreshToken(_id: string) {
    const payload = {
        sub: _id,
        type: 'REFRESH',
    };

    // The token will expire in 30 days
    if(REFRESH_SECRET) return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });
}

export function decodeAccessToken(access_token: string){
    try{
        const decode = jwt.verify(access_token, ACCESS_SECRET as string) as jwtPayload;
        return decode
    }catch{
        return
    }
}

export function decodeRefreshToken(refresh_token: string){
    try{
        const decode = jwt.verify(refresh_token, REFRESH_SECRET as string) as jwtPayload;
        return decode
    }catch{
        return
    }
}