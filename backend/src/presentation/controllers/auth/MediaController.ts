import { Request, Response } from "express";
import { IGetS3UploadUrlUseCase } from "../../../application/interfaces/media/IGetS3UploadUrlUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";

export class MediaController {
  constructor(
    private readonly _getS3UploadUrlUseCase: IGetS3UploadUrlUseCase
  ) { }

  getS3UploadUrl = async (req: Request, res: Response) => {
    try {
      const { fileName, contentType } = req.query as { fileName: string; contentType: string };

      const result = await this._getS3UploadUrlUseCase.execute(
        fileName,
        contentType
      );

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: result,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to get upload URL";
      return res.status(HttpStatusCode.INTERNAL_SERVER).json({
        success: false,
        message,
      });
    }
  };

}
