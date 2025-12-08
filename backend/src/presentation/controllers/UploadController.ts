import { Request, Response } from "express";
import { HttpStatusCode } from "../enums/httpCodes";
import { IUploadProfilePictureUseCase } from "../../application/interfaces/IUploadProfilePictureUseCase";
import { IUploadWorkerDocumentUseCase } from "../../application/interfaces/IUploadWorkerDocumentUseCase";
import { IUploadController } from "../interfaces/IUploadController";


export class UploadController implements IUploadController {
  constructor(
    private readonly uploadProfilePictureUseCase: IUploadProfilePictureUseCase,
    private readonly uploadDocumentUseCase: IUploadWorkerDocumentUseCase,
  ) { }

  uploadProfile = async (req: Request, res: Response) => {
    try {
      const workerId = req.params.workerId;
      const filePath = req.file?.path;

      if (!filePath)
        return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "File missing" });

      const result = await this.uploadProfilePictureUseCase.execute(workerId, filePath);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        url: result.url
      });
    } catch (error: any) {
      return res.status(HttpStatusCode.INTERNAL_SERVER).json({
        success: false,
        message: error.message
      });
    }
  };

  uploadDocument = async (req: Request, res: Response) => {
    try {
      const workerId = req.params.workerId;
      const filePath = req.file?.path;

      const result = await this.uploadDocumentUseCase.execute(workerId, filePath!);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        url: result.url
      });
    } catch (error: any) {
      return res.status(HttpStatusCode.INTERNAL_SERVER).json({
        success: false,
        message: error.message
      });
    }
  };


}
