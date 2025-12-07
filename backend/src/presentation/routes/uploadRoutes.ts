import { Router } from "express";
import { IUploadController } from "../interfaces/IUploadController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { upload } from "../middlewares/multerMiddleware";

const router = Router();

export function createUploadRoutes(
  uploadController: IUploadController,
  authMiddleware: AuthMiddleware
) {

    console.log("45454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545666666666666666666666666666666666666666666666666666666666666666666689")
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
