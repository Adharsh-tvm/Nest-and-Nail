import { Request, Response } from "express";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { IUploadProfilePictureUseCase } from "../../../application/interfaces/user/IUploadProfilePictureUseCase";
import { IUploadWorkerDocumentUseCase } from "../../../application/interfaces/user/IUploadWorkerDocumentUseCase";
import { IUploadController } from "../../interfaces/IUploadController";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";

export class UploadController implements IUploadController {
  constructor(
    private readonly _uploadProfilePictureUseCase: IUploadProfilePictureUseCase,
    private readonly _uploadDocumentUseCase: IUploadWorkerDocumentUseCase
  ) { }

  // ---------------- UPLOAD PROFILE ----------------
  uploadProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const workerId = req.params.workerId;
      const file = req.file;

      if (!file) {
        return res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHandler.error(RESPONSE_MESSAGES.BAD_REQUEST))
      }

      const result = await this._uploadProfilePictureUseCase.execute(
        workerId,
        file.path,
        file.mimetype
      );

      return res.status(HttpStatusCode.OK).json(ResponseHandler.success(result.url, RESPONSE_MESSAGES.PROFILE_UPDATED))
    } catch (error: unknown) {

      return res.status(HttpStatusCode.INTERNAL_SERVER).json(ResponseHandler.error(RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR, error))
    }
  };

  // ---------------- UPLOAD DOCUMENT ----------------
  uploadDocument = async (req: Request, res: Response): Promise<Response> => {
    try {
      const workerId = req.params.workerId;
      const file = req.file;

      if (!file) {
        return res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHandler.error(RESPONSE_MESSAGES.FILE_MISSING))
      }

      const result = await this._uploadDocumentUseCase.execute(
        workerId,
        file.path,
        file.mimetype
      );

      return res.status(HttpStatusCode.OK).json(ResponseHandler.success(result, RESPONSE_MESSAGES.DOCUMENT_UPLOADED));

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR;
      return res.status(HttpStatusCode.INTERNAL_SERVER).json(ResponseHandler.error(message, error));
    }
  };
}
