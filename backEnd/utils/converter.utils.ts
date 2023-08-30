import mongoose from "mongoose";
import { objectIdRegex } from "../constants/regex";

function transformToObjectId(data: any): mongoose.Types.ObjectId {
    // If data is already an ObjectId, return it
    if (data instanceof mongoose.Types.ObjectId) {
        return data;
    }

    // If data is a valid ObjectId string, convert and return it
    if (objectIdRegex.test(data)) {
        return new mongoose.Types.ObjectId(data);
    }

    throw new Error("Invalid ObjectId format");
}

export function convertToObjectIdRecursive(data: any): any {
    if (Array.isArray(data)) {
        return data.map(item => convertToObjectIdRecursive(item));
    }

    if (data && typeof data === 'object') {
        for (let key in data) {
            if (typeof data[key] === 'string' && objectIdRegex.test(data[key])) {
                data[key] = transformToObjectId(data[key]);
            } else {
                data[key] = convertToObjectIdRecursive(data[key]);
            }
        }
    }

    return data;
}
