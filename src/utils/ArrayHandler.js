export function stringArrayToTextareaValue(arr) {
  return Array.isArray(arr) ? arr.join('\n') : '';
}

export function textareaValueToStringArray(value) {
  const lines = value.split('\n').map(line => line.trim()).filter(Boolean);
  if (!lines.every(line => /^[^\r\n]+$/.test(line))) {
    throw new Error('This field must be plain text lines without control characters.');
  }
  return lines;
}