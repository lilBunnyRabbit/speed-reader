type TimeStamp = `${number}:${number}:${number}`;

export function secondsToTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const remainingSeconds = seconds - hours * 3600 - minutes * 60;

  return { hours, minutes, seconds: remainingSeconds };
}

export function wpmToTime(wpm: number, words: number) {
  if (!wpm) return { hours: 0, minutes: 0, seconds: 0 };
  return secondsToTime(Math.floor((words / wpm) * 60));
}

export function wpmToTimestamp(wpm: number, words: number) {
  const { hours, minutes, seconds } = wpmToTime(wpm, words);
  return [hours, minutes, seconds].map((v) => v.toString().padStart(2, "0")).join(":") as TimeStamp;
}

export function wpmToTimeString(wpm: number, words: number) {
  const { hours, minutes, seconds } = wpmToTime(wpm, words);
  return [hours && `${hours}h`, minutes && `${minutes}min`, seconds && `${seconds}s`].filter(Boolean).join(" ");
}
