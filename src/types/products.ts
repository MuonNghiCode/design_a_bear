// only for mock will delete after have api
import { type ProductCardProps } from "@/components/shared/ProductCard";

export type Category = "all" | "complete" | "bear" | "accessory";

export type SortOption = "newest" | "popular" | "price-asc" | "price-desc";

export interface ProductItem extends ProductCardProps {
  category: Category;
  popular?: boolean;
  createdAt?: number;
}

export interface ProductsClientProps {
  initialCategory?: string;
}
