import { Request, Response } from "express";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { IUploadProfilePictureUseCase } from "../../application/interfaces/IUploadProfilePictureUseCase";
import { IUploadWorkerDocumentUseCase } from "../../application/interfaces/IUploadWorkerDocumentUseCase";
import { IUploadController } from "../interfaces/IUploadController";


export class UploadController implements IUploadController {
  constructor(
    private readonly _uploadProfilePictureUseCase: IUploadProfilePictureUseCase,
    private readonly _uploadDocumentUseCase: IUploadWorkerDocumentUseCase,
  ) { }

  uploadProfile = async (req: Request, res: Response) => {
    try {
      const workerId = req.params.workerId;
      const filePath = req.file?.path;

      if (!filePath)
        return res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: "File missing" });

      const result = await this._uploadProfilePictureUseCase.execute(workerId, filePath);

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

      const result = await this._uploadDocumentUseCase.execute(workerId, filePath!);

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
