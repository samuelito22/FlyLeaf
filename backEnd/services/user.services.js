import User from "../models/user.model.js";

async function updateUserLocation(uid, locationData) {

  const updateObj = {
        'location.lastLocation': {
          ...locationData.coordinates && { type: 'Point', coordinates:{longitude: locationData.coordinates.longitude, latitude: locationData.coordinates.latitude} },
          ...locationData.city && {city: locationData.city}
        }
      };

  return await User.findOneAndUpdate(
    { uid },
    {
      $set: updateObj
    },
    { new: true }
  );
}

async function getUserLocation(uid) {
  return await User.findOne({ uid });
}

async function getUserProfile(uid) {
  return await User.findOne({ uid });
}

const UserServices = {updateUserLocation, getUserLocation, getUserProfile}
export default UserServices