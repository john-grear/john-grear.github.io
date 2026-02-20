<script setup lang="ts">
  defineProps<{ debug?: boolean }>();
</script>

<template>
  <div v-bind="$attrs" id="spawn" class="spawn" :class="{ 'border border-red-500': debug }"></div>
</template>
