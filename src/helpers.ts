export function isEmpty(value: null | string | [] | object) {
  if (value == null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  return false;
}
