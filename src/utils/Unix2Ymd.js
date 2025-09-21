function formatUnixTimestamp(unixTime) {
  const date = new Date(unixTime * 1000); // Convert seconds to milliseconds

  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');

  return `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
}
export { formatUnixTimestamp };