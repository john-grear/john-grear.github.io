<script setup lang="ts">
  import { start, stop } from '@/megaman/index';

  import { onMounted, onUnmounted } from 'vue';

  onMounted(start);
  onUnmounted(stop);

  // Stop spacebar from scrolling page
  window.addEventListener('keydown', (e) => {
    // Check if the pressed key is the spacebar
    if (e.key !== ' ') return;

    // Check there is a target
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Check if the event target is not an input, textarea, or a content-editable element
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      return;

    e.preventDefault();
  });
</script>

<template>
  <div class="mega-man"></div>
</template>

<style lang="css" scoped>
  @import url('@/megaman/assets/styles/main.css');
</style>
