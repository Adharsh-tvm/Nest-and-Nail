import { Request, Response } from "express";
import { IGetCloudinaryUploadSignatureUseCase } from "../../application/interfaces/media/IGetCloudinaryUploadSignatureUseCase";
import { ResponseHandler } from "../../shared/responses/ApiResponse";
import { HttpStatusCode } from "../../shared/enums/httpCodes";
import { IGetS3UploadUrlUseCase } from "../../application/interfaces/media/IGetS3UploadUrlUseCase";

export class MediaController {
  constructor(
    private readonly _getS3UploadUrlUseCase: IGetS3UploadUrlUseCase
  ) { }

  getS3UploadUrl = async (req: Request, res: Response) => {
    try {
      const { fileName, contentType } = req.body;

      const result = await this._getS3UploadUrlUseCase.execute(
        fileName,
        contentType
      );

      return res.status(200).json({
        success: true,
        payload: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

}
