<script setup lang="ts">
  import { useDialogService } from '@/services/useDialogService';

  import oldmegamanpng from '@/assets/images/old-mega-man.png';

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
    <SimpleCard>
      <p>{{ data.shortDescription }}</p>

      <p>
        This started out as a standard HTML / JavaScript project to use a CSS class that I could add
        onto any div to create Mega Man. I started working on this briefly before I started at GROB
        Systems Inc. where I started using Vue and PrimeVue. I learned how to use these and figured
        I should redo my portfolio, so I rewrote it.
      </p>
    </SimpleCard>

    <img class="!h-50 me-6 select-none rounded-xl object-contain" :src="oldmegamanpng" />

    <SimpleCard>
      <p>
        I took the sprites from
        <a
          href="https://www.sprites-inc.co.uk/sprite.php?local=/Classic/Megaman/MM8/"
          target="_blank"
          >here</a
        >, arranged them into a new sprite sheet, and set up the CSS to shift over Mega Man's sprite
        pixels based on an algorithm using CSS variables.
      </p>

      <p>You can see this in action on the <a href="/about">About Me</a> page.</p>
    </SimpleCard>
  </DialogCard>
</template>
