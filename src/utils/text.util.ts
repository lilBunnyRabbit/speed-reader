export function removeTimestamps(text: string): string {
  return text
    .replace(/^\n*\d{1,2}(:\d{1,2}){1,2}(\.\d{1,3})?(\n|\s)/g, "")
    .replace(/\n\d{1,2}(:\d{1,2}){1,2}(\.\d{1,3})?(\n|\s)/g, "\n");
}
