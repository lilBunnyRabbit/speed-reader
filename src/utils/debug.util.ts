export function debugLog(...args: any[]) {
  return console.log(new Date().toLocaleTimeString(), ...args);
}
