import {
  createEvent,
  getAllEvent,
  getEventById,
  updateEventById,
  softDeleteEventById
} from "../controllers/event.controllers.js";
import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import { alignStorage } from "../config/storage.js";
import multer from "multer";

const eventRoutes = Router();
const eventStorage = multer({ storage: alignStorage });

eventRoutes.post(
  "/",
  eventStorage.single("event-image"),
  verifyAccessToken,
  asyncHandler(createEvent)
);
eventRoutes.get("/", asyncHandler(getAllEvent));
eventRoutes.get("/:eventId", asyncHandler(getEventById));
eventRoutes.put(
  "/:eventId",
  eventStorage.single("event-image"),
  asyncHandler(updateEventById)
);
eventRoutes.delete("/:eventId", asyncHandler(softDeleteEventById));

export default eventRoutes;
