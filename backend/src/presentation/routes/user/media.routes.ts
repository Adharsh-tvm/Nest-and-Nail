import { Router } from "express";
import multer from "multer";
import { MediaController } from "../../controllers/MediaController";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

export function createMediaRoutes(controller: MediaController) {
  router.get(
    "/cloudinary/signature",
    controller.getCloudinarySignature
  );

  return router;
}
