import { Router } from "express";
import multer from "multer";
import { MediaController } from "../../controllers/MediaController";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

export function createMediaRoutes(controller: MediaController) {
  router.post(
    "/upload/images",
    upload.array("images", 5),
    controller.getCloudinarySignature
  );

  return router;
}
