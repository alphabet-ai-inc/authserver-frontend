function formatUnixTimestamp(unixTime) {
  const date = new Date(unixTime * 1000); // Convert seconds to milliseconds

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
}
export { formatUnixTimestamp };