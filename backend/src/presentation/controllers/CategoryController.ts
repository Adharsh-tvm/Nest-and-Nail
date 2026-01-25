import { Request, Response } from "express";
import { ICreateCategoryUseCase } from "../../application/interfaces/ICreateCategoryUseCase";
import { IGetAllCategoriesUseCase } from "../../application/interfaces/IGetAllCategoriesUseCase";
import { IUpdateCategoryStatusUseCase } from "../../application/interfaces/IUpdateCategoryStatusUseCase";
import { ICategoryController } from "../interfaces/ICategoryController";
import { ResponseHandler } from "../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../shared/responses/ResponseMessages";
import { HttpStatusCode } from "../../shared/enums/httpCodes";

export class CategoryController implements ICategoryController {
    constructor(
        private readonly createCategoryUseCase: ICreateCategoryUseCase,
        private readonly getAllCategoriesUseCase: IGetAllCategoriesUseCase,
        private readonly updateCategoryStatusUseCase: IUpdateCategoryStatusUseCase
    ) { }

    create = async (req: Request, res: Response) => {
        const { name } = req.body;
        const category = await this.createCategoryUseCase.execute(name);
        res.status(HttpStatusCode.CREATED).json(ResponseHandler.success(category, RESPONSE_MESSAGES.UPDATED));
    };

    getAll = async (_req: Request, res: Response) => {
        const categories = await this.getAllCategoriesUseCase.execute();
        res.status(HttpStatusCode.OK).json(ResponseHandler.success(categories, RESPONSE_MESSAGES.UPDATED));
    };

    updateStatus = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { isActive } = req.body;

        await this.updateCategoryStatusUseCase.execute(id, isActive);
        res.status(HttpStatusCode.OK).json(ResponseHandler.success(null, RESPONSE_MESSAGES.UPDATED));
    };
}
