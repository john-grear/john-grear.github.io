<template>
  <Card v-bind="$attrs">
    <template #content>
      <div class="flex flex-col gap-4">
        <slot />
      </div>
    </template>
  </Card>
</template>
