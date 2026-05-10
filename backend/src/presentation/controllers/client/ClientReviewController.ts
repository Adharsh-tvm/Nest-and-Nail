import { Request, Response } from "express";
import { IAddReviewUseCase } from "../../../application/interfaces/review/IAddReviewUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";

export class ClientReviewController {

  constructor(
    private readonly _addReviewUseCase: IAddReviewUseCase
  ) {}

  addReview = async (req: Request, res: Response) => {
    try {
      const clientId = req.user?.id;
      const { serviceId } = req.params;
      const { rating, review } = req.body as { rating?: number; review?: string };

      if (!clientId) {
        return res.status(HttpStatusCode.UNAUTHORIZED)
          .json(ResponseHandler.error("Unauthorized"));
      }

      if (!serviceId) {
        return res.status(HttpStatusCode.BAD_REQUEST)
          .json(ResponseHandler.error("Service ID is required"));
      }

      if (rating === undefined) {
        return res.status(HttpStatusCode.BAD_REQUEST)
          .json(ResponseHandler.error("Rating is required"));
      }

      await this._addReviewUseCase.execute(
        serviceId,
        clientId,
        rating,
        review ?? ""
      );

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, "Review submitted")
      );

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to submit review";
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(message)
      );
    }
  };
}