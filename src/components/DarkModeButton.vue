<script setup lang="ts">
  import { onMounted, ref } from 'vue';

  const isDarkModeEnabled = () => document.documentElement.classList.contains('dark-mode');

  const darkModeIcon = ref('pi pi-sun');

  const setDarkModeSunIcon = () => (darkModeIcon.value = 'pi pi-sun');
  const setDarkModeMoonIcon = () => (darkModeIcon.value = 'pi pi-moon');

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark-mode');

    if (isDarkModeEnabled()) {
      localStorage.setItem('theme', 'dark');
      setDarkModeSunIcon();
    } else {
      localStorage.setItem('theme', 'light');
      setDarkModeMoonIcon();
    }
  };

  // On component mount, check for saved preference
  onMounted(() => {
    if (!localStorage.getItem('theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (!prefersDark) return;

      document.documentElement.classList.add('dark-mode');
      setDarkModeSunIcon();
      return;
    }

    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark-mode');
      setDarkModeSunIcon();
    } else {
      setDarkModeMoonIcon();
    }
  });
</script>

<template>
  <!-- Dark Mode Button -->
  <Button :icon="darkModeIcon" class="p-button-text" @click="toggleDarkMode" />
</template>
