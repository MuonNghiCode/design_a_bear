import { type CartItem as ApiCartItem } from "@/types/responses";
import { type CartItem as UICartItem, type CartProduct } from "@/types/cart";

/**
 * Maps a raw Backend Cart Item to a clean Frontend UI Cart Item.
 * Consolidates all metadata fallbacks for names, images, and custom builds.
 */
export function mapApiCartItemToUI(
  apiItem: ApiCartItem,
  previousItem?: UICartItem,
): UICartItem {
  // 1. Resolve Build Details (handle renamed property for consistency)
  const build = (apiItem as any).buildDetails || apiItem.build;

  // 2. Resolve Product Name with multiple layers of fallback
  const safeProductName =
    build?.buildName ??           // Custom name from customization step
    apiItem.productNameSnapshot ??
    apiItem.productName ??
    build?.baseProductName ??      // Enriched by Backend Force-Fetch
    build?.baseProduct?.name ??    // Deep nested fallback
    previousItem?.product.name ??
    "Sản phẩm";

  // 3. Resolve Product Image with multiple layers of fallback
  const safeProductImage =
    build?.baseProductImageUrl ??  // Prioritize character image (e.g., blue Doraemon) if it's a build
    apiItem.productImageUrl ??
    build?.baseProduct?.media?.[0]?.url ??
    previousItem?.product.image ??
    "/teddy_bear.png";

  // 4. Construct the UI Product View
  const product: CartProduct = {
    id: apiItem.productId,
    name: safeProductName,
    description: apiItem.sku
      ? `Mã SP: ${apiItem.sku}`
      : (previousItem?.product.description ?? "Sản phẩm trong giỏ"),
    price: apiItem.unitPriceSnapshot ?? apiItem.variantPrice ?? 0,
    image: safeProductImage,
    slug: apiItem.productSlug ?? "",
    productType: apiItem.productType,
    badge: apiItem.productType === "BASE_BEAR" ? "Gấu bông" : "Sản phẩm",
    badgeColor: "#17409A",
    size: apiItem.size,
    sizeTag: apiItem.sizeTag,
    sku: apiItem.sku,
    href: apiItem.productSlug ? `/products/${apiItem.productSlug}` : undefined,
  };

  return {
    cartItemId: apiItem.cartItemId,
    productId: apiItem.productId,
    variantId: apiItem.variantId,
    buildId: apiItem.buildId,
    quantity: apiItem.quantity,
    product,
    buildDetails: build, // Propagate the full build (including components)
  };
}
