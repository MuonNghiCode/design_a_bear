export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function formatPrice(amount: number | null | undefined): string {
  if (amount === undefined || amount === null) return "0 vnđ";
  return amount.toLocaleString("vi-VN") + " vnđ";
}

export function formatInputAsCurrency(value: string | number): string {
  if (value === undefined || value === null || value === "") return "";
  const numString = value.toString().replace(/\D/g, "");
  if (!numString) return "";
  return parseInt(numString).toLocaleString("vi-VN").replace(/,/g, ".");
}
