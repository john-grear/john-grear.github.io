<template>
  <Card class="my-5 w-[90%] md:w-[75%] lg:w-[60%]" v-bind="$attrs">
    <template #content>
      <slot />
    </template>
  </Card>
</template>
