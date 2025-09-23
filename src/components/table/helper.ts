export const rowRenderer = (
  fn: (cell?: any, row?: any, index?: number) => React.ReactNode
) => {
  return (cell?: any, row?: any, index?: number) => fn(cell, row, index);
};
export const numberWithCommas = (number: number | string) => {
  if (number == null || number === "") return ""; // Handle null, undefined, or empty input
  const num =
    typeof number === "number"
      ? number
      : parseFloat(number.toString().replace(/,/g, ""));
  if (isNaN(num)) return ""; // Handle invalid numbers

  return num.toLocaleString("en-US"); // Use built-in formatting
};