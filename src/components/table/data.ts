import type { ColumnType, InternalModeProps, OrderType } from "./types";
export const positiveInteger = (value: unknown, fallback: number) => {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : fallback;
};
export function localRows(rows: any[], columns: ColumnType[], search: string, order: OrderType) {
  const lowered = search.toLocaleLowerCase();
  const filtered = lowered ? rows.filter(row => columns.some(col => col.data !== null && col.searchable !== false &&
    String(row[col.data] ?? "").toLocaleLowerCase().includes(lowered))) : [...rows];
  if (order) filtered.sort((a, b) => {
    const x = a[order.name], y = b[order.name];
    if (x == null && y == null) return 0;
    if (x == null) return 1;
    if (y == null) return -1;
    const result = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
    return order.dir === "asc" ? result : -result;
  });
  return filtered;
}
export function requestConfig(config: InternalModeProps["internalApiConfig"], payload: unknown) {
  const endpoint = config.endpoint;
  const url = /^(?:https?:)?\/\//i.test(endpoint) ? endpoint :
    config.baseUrl ? `${config.baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}` : endpoint;
  const method = config.method || "POST";
  return { url, method, headers: config.headers, ...(method === "GET" ? { params: config.payload ?? payload } : { data: config.payload ?? payload }) };
}
export function rowIdentity(row: any, index: number, key?: string | ((row: any) => string | number)) {
  return (typeof key === "function" ? key(row) : row[key || "id"]) ?? index;
}
