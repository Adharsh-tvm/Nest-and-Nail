import { Router } from "express";
import multer from "multer";
import { MediaController } from "../../controllers/auth/MediaController";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

export function createMediaRoutes(controller: MediaController) {
  router.get(
    "/s3-upload-url",
    controller.getS3UploadUrl
  );

  return router;
}
