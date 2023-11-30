import { writable, type Updater } from "svelte/store";

type Theme = "dark" | "light";
const darkClass = "dark";

function createThemeStore() {
  const theme = writable<Theme>(document.documentElement.classList.contains(darkClass) ? "dark" : "light");

  const updateClass = (theme: Theme) => {
    const classList = document.documentElement.classList;

    if (theme == "dark") {
      if (!classList.contains(darkClass)) {
        classList.add(darkClass);
      }
    } else {
      if (classList.contains(darkClass)) {
        classList.remove(darkClass);
      }
    }
  };

  const update = (updater: Updater<Theme>) => {
    theme.update((theme) => {
      const newTheme = updater(theme);
      updateClass(newTheme);
      return newTheme;
    });
  };

  const set = (newTheme: Theme) => {
    updateClass(newTheme);
    theme.set(newTheme);
  };

  return {
    subscribe: theme.subscribe,
    update,
    set,
    toggle: () => update((theme) => (theme === "dark" ? "light" : "dark")),
  };
}

export const theme = createThemeStore();
