export const rowRenderer = (
  fn: (cell?: any, row?: any, index?: number) => React.ReactNode
) => {
  return (cell?: any, row?: any, index?: number) => fn(cell, row, index);
};
