<script setup lang="ts">
  import { useIsSmallWindow } from '@/services/useIsSmallWindow';

  defineProps<{
    image?: string | undefined;
    gitLink?: string | undefined;
  }>();

  const { isSmallWindow } = useIsSmallWindow();
</script>

<template>
  <div v-if="image" class="flex gap-8" :class="{ 'flex-col items-center': isSmallWindow }">
    <img class="w-40 select-none object-contain" :src="image" />
    <div class="flex !w-full flex-col items-center justify-center gap-10">
      <slot />
    </div>
  </div>

  <div v-else class="flex gap-8" :class="{ 'flex-col items-center': isSmallWindow }">
    <slot />
  </div>

  <div v-if="gitLink" class="mt-4 flex justify-end">
    <a :href="gitLink" target="_blank">Git Link</a>
  </div>
</template>
