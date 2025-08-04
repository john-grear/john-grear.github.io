<script setup lang="ts">
  import { ref } from 'vue';

  defineProps<{ msg: string }>();

  const count = ref(0);
</script>

<template>
  <p class="text-6xl font-bold mb-6">John Grear</p>

  <hr class="max-w-40 mx-auto my-4 border-4 border-inherit rounded-[0.1875rem]" />

  <Card class="mb-4">
    <template #content>
      <p class="text-xl">
        Graduate of Bowling Green State University, working at GROB Systems Inc.
      </p>
    </template>
  </Card>

  <Button label="Click Me" @click="count++" class="p-button-raised p-button-rounded" />
</template>
