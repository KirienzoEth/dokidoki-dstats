export function toLocaleString(number, decimals = 2) {
  if (false === number instanceof Number) {
    number = Number(number)
  }

  return number.toLocaleString(undefined, { maximumFractionDigits: decimals })
}
