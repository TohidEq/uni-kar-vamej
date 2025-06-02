
export function PriceFormatter(value :number): string {
  const formattedPrice = new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR", // Iranian Rial
    currencyDisplay: "name", // Displays "ریال ایران" or similar
    minimumFractionDigits: 0, // No decimals for toman
  })
    .format(value)
    .replace("ریال ایران", "تومان"); // Replace "rial" with "toman"

  return formattedPrice;
}
