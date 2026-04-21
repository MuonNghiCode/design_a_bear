import { type CartItem } from "@/types/cart";

/**
 * Resolves all inventory-tracked components for a given cart item.
 * This includes the Base Variant and all selected Accessories.
 * Unified for both Cart and Checkout stock validation.
 */
export async function getComponentsForValidation(item: CartItem): Promise<{ identityId: string; isAccessory: boolean }[]> {
  const components: { identityId: string; isAccessory: boolean }[] = [];

  // 1. Base Variant (Main Product or Build Base)
  const baseId = item.baseVariantId || (item.product as any).productId || item.product.id;
  if (baseId) {
    components.push({ identityId: baseId, isAccessory: false });
  }

  // 2. Selected Accessories
  if (item.accessories && item.accessories.length > 0) {
    item.accessories.forEach((acc) => {
      components.push({ identityId: acc.id, isAccessory: true });
    });
  }

  return components;
}
