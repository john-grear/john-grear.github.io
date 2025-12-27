<script setup lang="ts">
  import { allKeys } from '@/megaman/utils/event-handler';

  import { ref, watch } from 'vue';

  import ControlsModal from './ControlsModal.vue';

  const visible = ref(true);
  const disappearing = ref(false);

  const showControls = ref(false);

  /**
   * Hides the controls text, then disables all related event listeners.
   */
  const hideControlsText = () => {
    disappearing.value = true;

    setTimeout(() => (visible.value = false), 3000);

    document.removeEventListener('scroll', detectScroll);
    document.removeEventListener('mousedown', detectScroll);

    window.removeEventListener('keydown', detectInput);
  };

  /**
   * Detects the first scroll to hide the controls text, then stops listening.
   */
  const detectScroll = () => {
    hideControlsText();
  };

  /**
   * Detects the first game-related key press to hide the controls text, then stops listening.
   */
  const detectInput = (e: KeyboardEvent) => {
    if (!allKeys.includes(e.key.toLowerCase())) return;

    hideControlsText();
  };

  document.addEventListener('scroll', detectScroll);
  document.addEventListener('mousedown', detectScroll);

  window.addEventListener('keydown', detectInput);

  const watchControlsModal = watch(showControls, () => {
    hideControlsText();
    watchControlsModal.stop();
  });

  // Show controls modal
  window.addEventListener('keydown', (e) => {
    // Check if the pressed key is escape
    if (e.key !== 'Escape') return;

    showControls.value = !showControls.value;

    e.preventDefault();
  });
</script>

<template>
  <div
    v-if="visible && !showControls"
    class="z-1000 fixed top-[40%] flex flex-col items-center opacity-100 transition-[0s]"
    :class="{ 'opacity-0! duration-1500!': disappearing }"
  >
    <text class="text-3xl font-bold">Press WASD to Start!</text>
    <text class="text-sm"> Press escape to see all controls </text>
  </div>

  <ControlsModal v-model:open="showControls" />
</template>
