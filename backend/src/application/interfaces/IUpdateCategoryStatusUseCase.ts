export interface IUpdateCategoryStatusUseCase {
  execute(categoryId: string, isActive: boolean): Promise<void>;
}
