
export function toDateTimeLocalValue (seconds) {
  if (seconds === null || seconds === undefined) return '';
  const date = new Date(seconds * 1000);
  return date.toISOString().slice(0, 16);
}