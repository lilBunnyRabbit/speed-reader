type TimeStamp = `${number}:${number}:${number}`;

export function parseSeconds(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const remainingSeconds = seconds - hours * 3600 - minutes * 60;

  return { hours, minutes, seconds: remainingSeconds };
}

export function wpmToTimestamp(wpm: number, words: number) {
  if (!wpm) return "00:00:00";
  const { hours, minutes, seconds } = parseSeconds(Math.floor((words / wpm) * 60));

  return [hours, minutes, seconds].map((v) => v.toString().padStart(2, "0")).join(":") as TimeStamp;
}
