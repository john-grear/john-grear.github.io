<script setup lang="ts">
  import { useDialogService } from '@/services/useDialogService';
  import { useIsSmallWindow } from '@/services/useIsSmallWindow';

  import { type Component } from 'vue';

  const props = defineProps<{
    header: string;
    startDate: string;
    endDate?: string | undefined;
    shortDescription: string;
    tools?: string[] | undefined;
    image: string;
    gitLink?: string | undefined;
    detailsDialog: Component | undefined;
  }>();

  const dateSpan = props.endDate ? `${props.startDate} - ${props.endDate}` : props.startDate;
  const toolsString = props.tools?.join(', ');

  const subheader = toolsString ? `${toolsString}\u2002|\u2002${dateSpan}` : dateSpan;

  const dialog = useDialogService();
  const openDialog = () => {
    if (!props.detailsDialog) return;

    dialog.openCustomHeaderDialog(props.detailsDialog, props.header, subheader, {
      shortDescription: props.shortDescription,
      image: props.image,
      gitLink: props.gitLink,
    });
  };

  const { isSmallWindow } = useIsSmallWindow();
</script>

<template>
  <CustomCard class="hover-card transition-transform duration-200" @click="openDialog">
    <div class="flex" :class="{ 'flex-col items-center': isSmallWindow }">
      <img class="me-6 !w-40 select-none object-contain" :src="props.image" />
      <div class="mx-auto flex flex-col">
        <p class="subheader text-center font-bold">{{ props.header }}</p>
        <p class="text-center">{{ subheader }}</p>
        <hr class="border-1 w-15 mx-auto my-4 rounded-[0.1875rem] border-inherit" />

        <p>{{ props.shortDescription }}</p>
      </div>
    </div>
  </CustomCard>
</template>

<style lang="css" scoped>
  .hover-card {
    border-color: #52525b;
    border-width: 2px;
    cursor: pointer;
  }

  .hover-card:hover {
    border-color: #71717a;
    scale: 105%;
  }
</style>
