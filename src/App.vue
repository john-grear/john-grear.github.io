<script setup lang="ts">
  import { initToastService } from '@/services/useToastService';

  import MainMenubar from '@/components/MainHeader.vue';

  initToastService();
</script>

<template>
  <Toast group="" />
  <DynamicDialog modal block-scroll />

  <div class="min-h-screen">
    <MainMenubar />

    <div class="flex flex-grow flex-col items-center">
      <RouterView />
    </div>

    <MainFooter />
  </div>
</template>

<style scoped>
  @reference "./main.css";

  p {
    @apply text-sm md:text-xl lg:text-3xl;
  }
</style>
