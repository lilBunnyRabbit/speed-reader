export function removeTimestamps(text: string): string {
  return text.replace(/^\n*\d+:\d+\n/g, "").replace(/\n\d+:\d+\n/g, "\n");
}
