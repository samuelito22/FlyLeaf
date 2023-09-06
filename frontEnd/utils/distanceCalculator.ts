// utils/distanceCalculator.js

const toRadians = (degrees: number) => {
  return degrees * Math.PI / 180;
};

export const calculateDistanceInKm = (coordinates1: {latitude: number, longitude: number}, coordinates2: {latitude: number, longitude: number}) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(coordinates2.latitude - coordinates1.latitude);
  const dLon = toRadians(coordinates2.longitude - coordinates1.longitude);

  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coordinates1.latitude)) * Math.cos(toRadians(coordinates2.latitude)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
};

export const calculateDistanceInMiles = (coordinates1: {latitude: number, longitude: number}, coordinates2: {latitude: number, longitude: number}) => {
  const distanceInKm = calculateDistanceInKm(coordinates1, coordinates2);
  return distanceInKm * 0.621371; // Convert km to miles
};
