import { ref } from 'vue';

export const isDarkMode = ref(document.documentElement.classList.contains('dark-mode'));

export const toggleDarkMode = () => {
  if (isDarkMode.value) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
};

export const enableDarkMode = () => {
  document.documentElement.classList.add('dark-mode');
  isDarkMode.value = true;
  localStorage.setItem('theme', 'dark');
};

export const disableDarkMode = () => {
  document.documentElement.classList.remove('dark-mode');
  isDarkMode.value = false;
  localStorage.setItem('theme', 'light');
};
