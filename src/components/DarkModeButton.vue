<script setup lang="ts">
  import { onMounted } from 'vue';

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark-mode');
    // Optionally, save the preference to localStorage
    if (document.documentElement.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  };

  // On component mount, check for saved preference
  onMounted(() => {
    if (!localStorage.getItem('theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (!prefersDark) return;

      document.documentElement.classList.add('dark-mode');
      return;
    }

    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }
  });
</script>

<template>
  <!-- Dark Mode Button -->
  <Button icon="pi pi-sun" class="p-button-text" @click="toggleDarkMode" />
</template>
