export interface Category {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryInput {
    name: string;
    slug: string;
    isActive?: boolean;
}
