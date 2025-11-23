import { ProductType } from "./ProductType";

export type RecommendationType = {
    count: number;
    products: ProductType[];
    user_id: number;
    version: number;
}