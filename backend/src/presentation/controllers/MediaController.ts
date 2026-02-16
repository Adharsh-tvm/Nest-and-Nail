import { Request, Response } from "express";
import { IGetS3UploadUrlUseCase } from "../../application/interfaces/media/IGetS3UploadUrlUseCase";

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
