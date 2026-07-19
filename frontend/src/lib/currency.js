const egpFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  currencyDisplay: "symbol",
  maximumFractionDigits: 0,
});

export const formatCurrency = (value) =>
  egpFormatter.format(Number(value ?? 0));
