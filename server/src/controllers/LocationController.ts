// controllers/locationController.ts
import { RequestHandler } from "express";
import { haversineDistance } from "../utils/distance";

const CAFE_LAT = 31.44944058518331; // Example latitude31.44943143240289, 31.670711964499414
const CAFE_LON = 31.670704588424908; // Example longitude
const RANGE_KM = 1; // Range in km

export const checkLocation: RequestHandler = (req, res, next) => {
  const { userLat, userLon } = req.body;

  if (!userLat || !userLon || isNaN(userLat) || isNaN(userLon)) {
    res.status(400).json({ message: "User location must be valid numbers" });
    return;
  }

  try {
    const distance = haversineDistance(CAFE_LAT, CAFE_LON, userLat, userLon);
    // if (distance <= RANGE_KM) {
    //   res.status(200).json({ message: "Within range for ordering" });
    //   return;
    // } else {
    //   res.status(403).json({ message: "Out of range for ordering" });
    //   return;
    res
      .status(200)
      .json({ message: "getting location from server", distance: distance });
    return;
    // }
  } catch (error) {
    next(error);
  }
};
