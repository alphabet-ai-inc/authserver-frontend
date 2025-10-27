// utils/fetchWithHandling.js
export async function fetchWithHandling(url, options = {}) {
  const response = await fetch(url, options);

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    const errorData = isJson ? await response.json() : await response.text();
    throw new Error(
      isJson ? errorData.error || JSON.stringify(errorData) : errorData
    );
  }

  return isJson ? await response.json() : await response.text();
}
export function handleError(error) {
  console.error("Error:", error);
  alert(error.message || "An unexpected error occurred.");
}