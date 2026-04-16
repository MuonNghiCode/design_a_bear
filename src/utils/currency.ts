export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function formatPrice(amount: number): string {
  return amount.toLocaleString("vi-VN") + " vnđ";
}

export function formatInputAsCurrency(value: string | number): string {
  if (value === undefined || value === null || value === "") return "";
  const numString = value.toString().replace(/\D/g, "");
  if (!numString) return "";
  return parseInt(numString).toLocaleString("vi-VN").replace(/,/g, ".");
}
