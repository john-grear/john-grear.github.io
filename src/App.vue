<script setup lang="ts">
  import { isDarkMode } from '@/services/useDarkMode';
  import { initToastService } from '@/services/useToastService';

  import { computed } from 'vue';

  import kirbyStarImage from '@/assets/images/kirby-star.png';
  import lordKnightmareImage from '@/assets/images/lord-knightmare.png';
  import metaKnightImage from '@/assets/images/meta-knight.png';
  import waddleDeeImage from '@/assets/images/waddle-dee.png';

  import MainMenubar from '@/components/MainHeader.vue';

  const kirbyImage = computed(() => (isDarkMode.value ? metaKnightImage : kirbyStarImage));
  const kirbySubImage = computed(() => (isDarkMode.value ? lordKnightmareImage : waddleDeeImage));

  initToastService();
</script>

<template>
  <Toast group="" />
  <DynamicDialog modal block-scroll />

  <div class="min-h-screen">
    <MainMenubar />

    <Image
      :src="kirbyImage"
      class="scale-120 fixed right-[10%] top-[15%] z-[-1001] blur-lg dark:top-[30%]"
    />
    <Image
      :src="kirbySubImage"
      class="dark:scale-120 not-2xl:hidden fixed left-[5%] top-[20%] z-[-1002] blur-lg"
    />

    <div class="flex flex-grow flex-col items-center">
      <RouterView />
    </div>

    <MainFooter />
  </div>
</template>
