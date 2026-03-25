import { Request, Response } from "express";
import { ICreateCategoryUseCase } from "../../../application/interfaces/category/ICreateCategoryUseCase";
import { IGetAllCategoriesUseCase } from "../../../application/interfaces/category/IGetAllCategoriesUseCase";
import { IUpdateCategoryUseCase } from "../../../application/interfaces/category/IUpdateCategoryUseCase";
import { ICategoryController } from "../../interfaces/ICategoryController";
import { ResponseHandler } from "../../../shared/responses/ApiResponse";
import { RESPONSE_MESSAGES } from "../../../shared/responses/ResponseMessages";
import { HttpStatusCode } from "../../../shared/enums/httpCodes";
import { IUpdateCategoryStatusUseCase } from "../../../application/interfaces/category/IUpdateCategoryStatusUseCase";
import { IUpdateWorkerCategoriesUseCase } from "../../../application/interfaces/worker/profile/IUpdateWorkerCategoriesUseCase";


export class CategoryController implements ICategoryController {
    constructor(
        private readonly _createCategoryUseCase: ICreateCategoryUseCase,
        private readonly _getAllCategoriesUseCase: IGetAllCategoriesUseCase,
        private readonly _updateCategoryUseCase: IUpdateCategoryUseCase,
        private readonly _updateCategoryStatusUseCase: IUpdateCategoryStatusUseCase,
        private readonly _updateWorkerCategoriesUseCase: IUpdateWorkerCategoriesUseCase
    ) { }

    create = async (req: Request, res: Response) => {
        const { name } = req.body;
        const category = await this._createCategoryUseCase.execute(name);
        res.status(HttpStatusCode.CREATED).json(ResponseHandler.success(category, RESPONSE_MESSAGES.UPDATED));
    };

    getAll = async (_req: Request, res: Response) => {
        const categories = await this._getAllCategoriesUseCase.execute();
        res.status(HttpStatusCode.OK).json(ResponseHandler.success(categories, RESPONSE_MESSAGES.UPDATED));
    };

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, isActive } = req.body;

            const category = await this._updateCategoryUseCase.execute(id, {
                name,
                isActive,
            });

            res.status(HttpStatusCode.OK).json(
                ResponseHandler.success(category, RESPONSE_MESSAGES.UPDATED)
            );
        } catch (error: any) {
            console.error("[CategoryController.update]", error);

            res.status(HttpStatusCode.BAD_REQUEST).json(
                ResponseHandler.error(
                    error.message || "Failed to update category"
                )
            );
        }
    }

    updateStatus = async (req: Request, res: Response) => {
        const { id } = req.params;

        const updatedCategory =
            await this._updateCategoryStatusUseCase.execute(id);

        res.status(HttpStatusCode.OK).json(
            ResponseHandler.success(updatedCategory, RESPONSE_MESSAGES.UPDATED)
        );
    };

    updateUserCategories = async (req: Request, res: Response): Promise<void> => {
        const userId = req.params.userId;
        const { categoryIds } = req.body;

        if (!Array.isArray(categoryIds)) {
            res.status(HttpStatusCode.BAD_REQUEST).json(
                ResponseHandler.error("categoryIds must be an array")
            );
            return;
        }

        const updatedUser = await this._updateWorkerCategoriesUseCase.execute(
            userId,
            categoryIds
        );

        res.status(HttpStatusCode.OK).json(
            ResponseHandler.success(
                updatedUser,
                RESPONSE_MESSAGES.UPDATED
            )
        );
    }
}
