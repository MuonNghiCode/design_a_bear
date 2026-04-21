import { type ProductCardProps } from "@/components/shared/ProductCard";
import {
  type ProductVariantResponse,
  type AccessoryResponse,
} from "@/types/responses";

export type Category = "all" | "complete" | "bear" | "accessory";

export type SortOption = "newest" | "popular" | "price-asc" | "price-desc";

export interface ProductItem extends ProductCardProps {
  category: Category;
  popular?: boolean;
  createdAt?: number;
  images?: string[];
  categories?: string[];
  characters?: string[];
  variants?: ProductVariantResponse[];
  available?: number;
  accessories?: AccessoryResponse[];
}

export interface ProductsClientProps {
  initialCategory?: string;
}
