<script setup lang="ts">
  import {
    disableDarkMode,
    enableDarkMode,
    isDarkMode,
    toggleDarkMode,
  } from '@/services/useDarkMode';

  import { onMounted, ref } from 'vue';

  const darkModeIcon = ref('pi pi-sun');

  const setDarkModeSunIcon = () => (darkModeIcon.value = 'pi pi-sun');
  const setDarkModeMoonIcon = () => (darkModeIcon.value = 'pi pi-moon');

  const toggle = () => {
    toggleDarkMode();

    isDarkMode.value ? setDarkModeMoonIcon() : setDarkModeSunIcon();
  };

  // On component mount, check for saved preference
  onMounted(() => {
    const darkModeLastUsed = localStorage.getItem('theme') === 'dark';
    const darkThemePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (darkThemePreference || darkModeLastUsed) {
      enableDarkMode();
      setDarkModeMoonIcon();
    } else {
      disableDarkMode();
      setDarkModeSunIcon();
    }
  });
</script>

<template>
  <!-- Dark Mode Button -->
  <Button :icon="darkModeIcon" class="p-button-text" @click="toggle" />
</template>
