<template>
  <Card class="my-5 w-[60%]" v-bind="$attrs">
    <template #content>
      <slot />
    </template>
  </Card>
</template>
