/**
 * Generates a combination key for product + accessories.
 * Rule: Sort accessory IDs, exclude AI_PROCESSOR types (if logic holds), and join with |.
 * Note: Since we don't always know the type in this utility, we rely on the caller to filter 
 * or we just follow the sorting + joining rule.
 */
export const generateCombinationKey = (accessoryIds: string[]): string => {
  if (!accessoryIds || accessoryIds.length === 0) return "";
  
  // Sort alphabetical to ensure consistency
  const sortedIds = [...accessoryIds]
    .filter(id => id && id !== "undefined" && id !== "null")
    .sort((a, b) => a.localeCompare(b));
    
  return sortedIds.join("|");
};

/**
 * Validates if an accessory type should be excluded from the combination key.
 */
export const isImageAffectingAccessory = (productType: string): boolean => {
  return productType !== "AI_PROCESSOR";
};
