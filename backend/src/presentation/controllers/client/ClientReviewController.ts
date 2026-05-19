import { Request, Response } from "express";
import { IAddReviewUseCase } from "../../../application/interfaces/review/IAddReviewUseCase";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";

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
          .json(ResponseHandler.error(RESPONSE_MESSAGES.UNAUTHORIZED));
      }

      if (!serviceId) {
        return res.status(HttpStatusCode.BAD_REQUEST)
          .json(ResponseHandler.error(RESPONSE_MESSAGES.SERVICE_ID_REQUIRED));
      }

      if (rating === undefined) {
        return res.status(HttpStatusCode.BAD_REQUEST)
          .json(ResponseHandler.error(RESPONSE_MESSAGES.RATING_REQUIRED));
      }

      await this._addReviewUseCase.execute(
        serviceId,
        clientId,
        rating,
        review ?? ""
      );

      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(null, RESPONSE_MESSAGES.REVIEW_SUBMITTED)
      );

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to submit review";
      res.status(HttpStatusCode.BAD_REQUEST).json(
        ResponseHandler.error(message)
      );
    }
  };
}