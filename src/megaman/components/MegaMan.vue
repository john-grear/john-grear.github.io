<script setup lang="ts">
  import { useGame } from '@/megaman/composables/useGame';

  import { computed, onMounted, onUnmounted } from 'vue';

  const { start, stop, megaMan } = useGame();

  const jumping = computed(() => !megaMan.value?.grounded);
  const sliding = computed(() => megaMan.value?.sliding);

  defineProps<{ debug?: boolean }>();

  // Slow down the start function to let styling position everything first
  // Removing RAF's breaks the positioning of everything except MegaMan
  // Only an issue because spawn is using margin instead of a fixed position from absolute and top
  onMounted(() => {
    setTimeout(start, 10);
  });

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
  <div id="mega-man" class="mega-man" :jumping="jumping || null" :sliding="sliding || null">
    <div
      id="mega-man-collision"
      class="mega-man-collision"
      :class="{ 'border border-pink-500': debug }"
    ></div>
  </div>
</template>

<style lang="css" scoped>
  @import url('@/megaman/assets/styles/main.css');
</style>
