<script setup lang="ts">
  defineProps({
    keys: { type: String, required: true },
    label: { type: String, required: true },
  });
</script>

<template>
  <div class="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2">
    <span class="font-mono text-sm text-cyan-300">{{ keys }}</span>
    <span class="text-sm">{{ label }}</span>
  </div>
</template>
