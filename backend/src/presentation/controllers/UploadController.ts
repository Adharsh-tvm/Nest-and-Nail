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
        return ResponseHandler.error(
          res,
          RESPONSE_MESSAGES.FILE_MISSING,
          HttpStatusCode.BAD_REQUEST
        );
      }

      const result = await this._uploadProfilePictureUseCase.execute(
        workerId,
        filePath
      );

      return ResponseHandler.success(
        res,
        { url: result.url },
        RESPONSE_MESSAGES.PROFILE_UPLOADED,
        HttpStatusCode.OK
      );
    } catch (error: any) {
      return ResponseHandler.error(
        res,
        RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatusCode.INTERNAL_SERVER,
        error
      );
    }
  };

  // ---------------- UPLOAD DOCUMENT ----------------
  uploadDocument = async (req: Request, res: Response): Promise<Response> => {
    try {
      const workerId = req.params.workerId;
      const filePath = req.file?.path;

      if (!filePath) {
        return ResponseHandler.error(
          res,
          RESPONSE_MESSAGES.FILE_MISSING,
          HttpStatusCode.BAD_REQUEST
        );
      }

      const result = await this._uploadDocumentUseCase.execute(
        workerId,
        filePath
      );

      return ResponseHandler.success(
        res,
        { url: result.url },
        RESPONSE_MESSAGES.DOCUMENT_UPLOADED,
        HttpStatusCode.OK
      );
    } catch (error: any) {
      return ResponseHandler.error(
        res,
        RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatusCode.INTERNAL_SERVER,
        error
      );
    }
  };
}
