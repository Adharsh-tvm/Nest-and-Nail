import { Router } from "express";
import { IUploadController } from "../interfaces/IUploadController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { upload } from "../middlewares/multerMiddleware";

const router = Router();

export function createUploadRoutes(
  uploadController: IUploadController,
  authMiddleware: AuthMiddleware
) {

  // Upload Profile Picture
  router.post(
    "/worker/:workerId/profile",
    authMiddleware.verify.bind(authMiddleware),
    upload.single("file"),
    (req, res) => uploadController.uploadProfile(req, res)
  );
  

  // Upload Documents
  router.post(
    "/worker/:workerId/document",
    authMiddleware.verify.bind(authMiddleware),
    upload.single("file"),
    (req, res) => uploadController.uploadDocument(req, res)
  );

  return router;
}
