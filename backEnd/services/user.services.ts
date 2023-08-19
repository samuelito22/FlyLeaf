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

const UserServices = {updateUserLocation, getUserLocation, getUserProfile}
export default UserServices