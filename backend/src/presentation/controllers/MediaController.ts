import { Request, Response } from "express";
import { IGetCloudinaryUploadSignatureUseCase } from "../../application/interfaces/media/IGetCloudinaryUploadSignatureUseCase";
import { ResponseHandler } from "../../shared/responses/ApiResponse";
import { HttpStatusCode } from "../../shared/enums/httpCodes";

export class MediaController {
  constructor(
    private readonly getSignatureUseCase: IGetCloudinaryUploadSignatureUseCase
  ) {}

  getCloudinarySignature = async (_req: Request, res: Response) => {
    try {
      const signature = this.getSignatureUseCase.execute();

      return res.json(
        ResponseHandler.success(
          signature,
          "Cloudinary upload signature generated"
        )
      );
    } catch (error: any) {
      return res.status(HttpStatusCode.INTERNAL_SERVER).json(
        ResponseHandler.error(error.message)
      );
    }
  };
}
