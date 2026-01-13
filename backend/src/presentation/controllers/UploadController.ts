import { Request, Response } from "express";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { IUploadProfilePictureUseCase } from "../../application/interfaces/IUploadProfilePictureUseCase";
import { IUploadWorkerDocumentUseCase } from "../../application/interfaces/IUploadWorkerDocumentUseCase";
import { IUploadController } from "../interfaces/IUploadController";
import { ResponseHandler } from "../responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../responses/ResponseMessages";

export class UploadController implements IUploadController {
  constructor(
    private readonly _uploadProfilePictureUseCase: IUploadProfilePictureUseCase,
    private readonly _uploadDocumentUseCase: IUploadWorkerDocumentUseCase
  ) { }

  // ---------------- UPLOAD PROFILE ----------------
  uploadProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const workerId = req.params.workerId;
      const filePath = req.file?.path;

      if (!filePath) {
        return res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST))
      }

      const result = await this._uploadProfilePictureUseCase.execute(
        workerId,
        filePath
      );

      return res.status(HttpStatusCode.INTERNAL_SERVER).json(ResponseHandler.success(result.url, RESPONSE_MESSAGES.PROFILE_UPDATED))
    } catch (error: any) {

      return res.status(HttpStatusCode.INTERNAL_SERVER).json(ResponseHandler.error(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, error))
    }
  };

  // ---------------- UPLOAD DOCUMENT ----------------
  uploadDocument = async (req: Request, res: Response): Promise<Response> => {
    try {
      const workerId = req.params.workerId;
      const filePath = req.file?.path;

      if (!filePath) {
        return res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHandler.error(RESPONSE_MESSAGES.FILE_MISSING))
      }

      const result = await this._uploadDocumentUseCase.execute(
        workerId,
        filePath
      );

      return res.status(HttpStatusCode.OK).json(ResponseHandler.success(result, RESPONSE_MESSAGES.DOCUMENT_UPLOADED));

    } catch (error: any) {

      return res.status(HttpStatusCode.INTERNAL_SERVER).json(ResponseHandler.error(error.message, error))
    }
  };
}
