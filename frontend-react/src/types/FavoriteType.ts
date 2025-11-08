import { ProductType } from "./ProductType";

export type FavoriteType = {
    id: number;
    userId: number;
    productId?: number;
    product?: ProductType;
}