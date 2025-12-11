<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => import('@/megaman/index'));
</script>

<template>
  <div class="mega-man" />
</template>

<style lang="css" scoped>
  @import url('@/megaman/assets/styles/main.css');
</style>
