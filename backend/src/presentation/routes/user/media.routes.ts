import { Router } from "express";
import { MediaController } from "../../controllers/auth/MediaController";

const router = Router();

export function createMediaRoutes(controller: MediaController) {
  router.get(
    "/s3-upload-url",
    (req, res) => { void controller.getS3UploadUrl(req, res); }
  );

  return router;
}
