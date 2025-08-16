<script setup lang="ts">
  defineProps({
    header: String,
    subheader: String,
  });
</script>

<template>
  <p class="mb-6 text-6xl font-bold">{{ header }}</p>

  <p v-if="subheader" class="mb-6 text-2xl">{{ subheader }}</p>

  <hr class="w-30 mx-auto my-4 rounded-[0.1875rem] border-2 border-inherit" />
</template>
