export function rsd(v) {
  return new Intl.NumberFormat("sr-RS", {maximumFractionDigits:0}).format(Number(v || 0)) + " RSD";
}
