<script setup lang="ts">
  import { useDialogService } from '@/services/useDialogService';

  const dialog = useDialogService().getDialog();
  const data: {
    dateSpan: string;
    shortDescription: string;
    image: string;
    gitLink?: string;
  } = dialog?.data;
</script>

<template>
  <DialogCard :image="data.image" :git-link="data.gitLink">
    <SimpleCard class="flex flex-col gap-4">
      <p>{{ data.shortDescription }}</p>

      <p>
        The purpose of this app was to allow people to create custom D&D characters with every
        aspect of character creation available to them (i.e. custom class creation, image selection
        / custom image upload, custom lore, etc.). They could then save different profiles for sets
        of characters that belong to different campaigns. Because this app had a lot of
        customization, it would even work for tabletop RPG games similar to D&D like Pathfinder,
        Call of Cthulhu, etc.
      </p>
    </SimpleCard>
  </DialogCard>
</template>
