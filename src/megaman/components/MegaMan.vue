<script setup lang="ts">
  import { useGame } from '@/megaman/composables/useGame';
  import { useMegaMan } from '@/megaman/composables/useMegaMan';

  import { onMounted, onUnmounted } from 'vue';

  const megaMan = useMegaMan();
  const { start, stop } = useGame(megaMan);

  // Slow down the start function to let styling position everything first
  // Removing RAF's breaks the positioning of everything except MegaMan
  // Only an issue because spawn is using margin instead of a fixed position from absolute and top
  onMounted(() => {
    setTimeout(start, 1);
    // requestAnimationFrame(() =>
    //   requestAnimationFrame(() =>
    //     requestAnimationFrame(() =>
    //       requestAnimationFrame(() =>
    //         requestAnimationFrame(() =>
    //           requestAnimationFrame(() =>
    //             requestAnimationFrame(() =>
    //               requestAnimationFrame(() => requestAnimationFrame(start))
    //             )
    //           )
    //         )
    //       )
    //     )
    //   )
    // );
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
  <div id="mega-man" class="mega-man"></div>
</template>

<style lang="css" scoped>
  @import url('@/megaman/assets/styles/main.css');
</style>
