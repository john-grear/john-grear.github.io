<script setup>
  const props = defineProps({
    modelValue: Boolean,
    imgSrc: String,
  });
  const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <Dialog :visible="props.modelValue" @update:visible="emit('update:modelValue', $event)">
    <template #header> &nbsp; </template>
    <template #default>
      <img :src="imgSrc" alt="" class="w-full !rounded-xl" preview />
    </template>
  </Dialog>
</template>
