<script setup lang="ts">
  import MegaMan from '@/megaman/components/MegaMan.vue';
  import Spawn from '@/megaman/components/Spawn.vue';

  import { ref } from 'vue';

  import ghostbustersSocksJpg from '@/assets/images/ghostbusters-socks.png';
  import megamanGIF from '@/assets/images/mega-man-5.gif';
  import rickAndMortySocksJpg from '@/assets/images/rick-and-morty-socks.png';
  import spidermanSocksJpg from '@/assets/images/spiderman-socks.png';
  import youLikeSocksJpg from '@/assets/images/you-like-socks.jpg';

  import CustomCard from '@/components/CustomCard.vue';

  const socksDialogVisible = ref(false);
  const enableSocksDialog = () => (socksDialogVisible.value = true);
</script>

<template>
  <Header header="About Me" subheader="Who Am I?" />

  <MegaMan />

  <CustomCard>
    <p>
      I am always looking to broaden my horizons and strive to be a better person and software
      developer. I really want to travel the world, so any opportunities that would allow that would
      be a dream! I enjoy playing video games, cooking new foods, and solving puzzles.
    </p>
  </CustomCard>

  <div class="passable flex w-[40%] justify-center">
    <img :src="megamanGIF" alt="Mega Man 5" class="w-full max-w-2xl !rounded-xl" />
    <Spawn class="size-30 absolute -mb-3 self-end" />
  </div>

  <CustomCard>
    <p>
      My favorite video games are Minecraft, Hollow Knight, Neva, Pokemon, and NES games like Mega
      Man and Kirby's Adventure.
    </p>
  </CustomCard>

  <CustomCard>
    <p>
      I love cooking and trying foods from all over the world. Some of my favorite foods to cook are
      fettucine alfredo and breads of all kind (which I guess is also technically baking haha). I
      love solving puzzles and challenging myself.
    </p>
  </CustomCard>

  <CustomCard>
    <p>
      I started collecting Rubik's Cubes back in junior high school and sat in my room for days
      figuring out how to solve my first 3x3. Now I have over 20 and I still try to get to them all
      occasionally. I also love collecting playing cards to remember places that I've been to.
    </p>
  </CustomCard>

  <div class="passable relative mt-5 flex items-center justify-center gap-[-6rem]">
    <SockImageButton
      :src="spidermanSocksJpg"
      alt="Spiderman Socks"
      class="translate-y-4 rotate-[-10deg]"
      @show-dialog="enableSocksDialog"
    />

    <SockImageButton
      :src="rickAndMortySocksJpg"
      alt="Rick and Morty Socks"
      class="-translate-y-10 rotate-[5deg] scale-105"
      @show-dialog="enableSocksDialog"
    />

    <SockImageButton
      :src="ghostbustersSocksJpg"
      alt="Ghostbusters Socks"
      class="translate-y-4 rotate-[12deg]"
      @show-dialog="enableSocksDialog"
    />
  </div>

  <CustomCard>
    <p>
      I’ve got a pretty wild sock collection—easily over 100 pairs at this point. It all started
      back in junior high when I got tired of plain white socks and decided to switch things up. Now
      I’ve got socks with everything from food prints to movie and video game characters. Honestly,
      it makes getting dressed a little more fun each morning. If you’re thinking of upgrading your
      sock game, I’d recommend checking out Wal-Mart—they’ve got sets of six crew socks for around
      $10, which is where I usually stock up.
    </p>
  </CustomCard>

  <SockDialog v-model="socksDialogVisible" :img-src="youLikeSocksJpg" />
</template>

<style scoped>
  ::v-deep(.p-dialog-header, .p-dialog-content) {
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    display: none !important;
  }

  ::v-deep(.p-dialog-header) {
    display: none !important;
  }

  ::v-deep(.p-dialog) {
    width: 100vw;
    max-width: none;
    height: 100vh;
    max-height: none;
    overflow: hidden;
    background: transparent;
  }
</style>
