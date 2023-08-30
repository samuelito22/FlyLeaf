import  jwt  from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "../config/config";
import { jwtPayload } from "../../types";
import express from "express"
import { EXPIRED_TOKEN, INVALID_GRANT_TYPE, UNAUTHORIZED_REQUEST } from "../constants/errors";
import mongoose from "mongoose";

export function createAccessToken(_id: string) {
    const payload = {
        sub: _id,  
        type: 'ACCESS', 
    };

    // The token will expire in 1 day (24 hours)
    if(ACCESS_SECRET) return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1d' });
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
        return {...decode, sub: new mongoose.Types.ObjectId(decode.sub)}
    }catch{
        throw new Error(EXPIRED_TOKEN)
    }
}

export function decodeRefreshToken(refresh_token: string){
    try{
        const decode = jwt.verify(refresh_token, REFRESH_SECRET as string) as jwtPayload;
    return {...decode, sub: new mongoose.Types.ObjectId(decode.sub)}
    }
    
    catch{
        throw new Error(EXPIRED_TOKEN)
    }
}

export function extractTokenFromHeader(req: express.Request): string | null {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null
    if(!token) throw new Error(UNAUTHORIZED_REQUEST)
    else return token 
  }
  
  export function validateGrantType(grantType: "refresh_token" | "access_token", grantNeeded: "refresh_token" | "access_token") {
    if (!grantType || grantType != grantNeeded) {
      throw new Error(INVALID_GRANT_TYPE);
    }
  }