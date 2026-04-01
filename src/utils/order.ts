export function formatShortOrderCode(orderCode?: string | null): string {
  if (!orderCode) return "";

  const digits = orderCode.replace(/\D/g, "");
  if (digits.length > 0) {
    const shortDigits = digits.slice(-3).padStart(3, "0");
    return `ORD-${shortDigits}`;
  }

  return orderCode;
}
