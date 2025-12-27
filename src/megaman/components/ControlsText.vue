<script setup lang="ts">
  import { allKeys } from '@/megaman/utils/event-handler';

  import { ref } from 'vue';

  const visible = ref(true);
  const disappearing = ref(false);

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
</script>

<template>
  <text
    v-if="visible"
    class="z-1000 fixed top-[40%] text-3xl font-bold opacity-100 transition-[0s]"
    :class="{ 'opacity-0! duration-1500!': disappearing }"
  >
    Press WASD, Space, or Left Click to Start!
  </text>
</template>
