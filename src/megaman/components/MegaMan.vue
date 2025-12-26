<script setup lang="ts">
  import { start, stop } from '@/megaman/index';

  import { onMounted, onUnmounted } from 'vue';

  onMounted(start);
  onUnmounted(stop);
</script>

<template>
  <div class="mega-man"></div>
</template>

<style lang="css" scoped>
  @import url('@/megaman/assets/styles/main.css');
</style>
