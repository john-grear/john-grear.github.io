<script setup lang="ts">
  defineProps<{
    image?: string | undefined;
    gitLink?: string | undefined;
  }>();
</script>

<template>
  <Card v-bind="$attrs">
    <template #content>
      <div v-if="image" class="flex gap-8">
        <img class="!w-40 select-none object-contain" :src="image" />
        <div class="flex !w-full flex-col items-center justify-center gap-10">
          <slot />
        </div>
      </div>

      <div v-else class="flex gap-8">
        <slot />
      </div>
    </template>

    <template #footer>
      <div v-if="gitLink" class="flex justify-end">
        <a :href="gitLink" target="_blank">Git Link</a>
      </div>
    </template>
  </Card>
</template>
