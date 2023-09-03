import mongoose from "mongoose";
import PremiumModel from "../models/premium.model";
import SettingsModel from "../models/settings.model";
import User from "../models/user.model";


async function updateUserLocation(uid:string, locationData:{coordinates: {longitude: number, latitude:number}, city: string}) {

  const updateObj = {
        'location.lastLocation': {
          ...locationData.coordinates && { type: 'Point', coordinates:{longitude: locationData.coordinates.longitude, latitude: locationData.coordinates.latitude} },
          ...locationData.city && {city: locationData.city}
        }
      };

  return await User.findOneAndUpdate(
    { _id: uid },
    {
      $set: updateObj
    },
    { new: true }
  );
}

async function getUserLocation(uid:string) {
  return await User.findOne({_id: uid });
}

async function getUserProfile(uid:string) {
  return await User.findOne({ _id: uid });
}

const updatePremiumInDB = async (premiumUpdate:any, userId: mongoose.Types.ObjectId, session?:any) => {
  return await PremiumModel.findOneAndUpdate(
    { _id: userId },
    premiumUpdate,
    {
      new: true,
      session,
    }
  );
};

const updateSettingsInDB = async (settingsUpdate:any, userId: mongoose.Types.ObjectId, session?: any) => {
  return await SettingsModel.findOneAndUpdate(
    { _id: userId },
    settingsUpdate,
    {
      new: true,
      session,
    }
  );
};

const UserServices = {updateUserLocation, getUserLocation, getUserProfile, updatePremiumInDB, updateSettingsInDB}
export default UserServices