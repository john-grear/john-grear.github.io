<script setup lang="ts">
  defineProps({
    header: String,
    subheader: String,
  });
</script>

<template>
  <p class="header mb-6 font-bold">{{ header }}</p>

  <p v-if="subheader" class="subheader mx-10 mb-6">
    {{ subheader }}
  </p>

  <hr class="w-30 mx-auto my-4 rounded-[0.1875rem] border-2 border-inherit" />
</template>
