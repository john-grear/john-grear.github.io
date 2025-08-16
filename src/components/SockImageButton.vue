<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    src: String,
    alt: String,
    class: String,
  });

  const emit = defineEmits(['show-dialog']);

  const sockTimer = ref();
  const sockTimeRemaining = ref(3000);

  const startSockDialogTimer = () => {
    if (sockTimer.value) return;

    sockTimer.value = setInterval(() => {
      sockTimeRemaining.value -= 10;

      if (sockTimeRemaining.value <= 0) {
        stopSockDialogTimer();
        emit('show-dialog');
      }
    }, 10);
  };

  const stopSockDialogTimer = () => {
    if (!sockTimer.value) return;

    clearInterval(sockTimer.value);
    sockTimer.value = undefined;
    sockTimeRemaining.value = 3000;
  };

  const handleClick = () => emit('show-dialog');
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    class="size-[20%] cursor-pointer select-none transition-transform hover:-translate-y-2 hover:rotate-0"
    :class="class"
    @click="handleClick"
    @mouseover="startSockDialogTimer"
    @mouseleave="stopSockDialogTimer"
  />
</template>
