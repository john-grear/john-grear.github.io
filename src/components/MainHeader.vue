<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import { RouterLink } from 'vue-router';

  import johnJpeg from '@/assets/images/john.jpeg';

  const links = [
    { to: '/about', label: 'About Me' },
    { to: '/education', label: 'Education' },
    { to: '/experience', label: 'Experience' },
    { to: '/resume', label: 'Resume', click: () => openResume() },
  ];

  const openResume = () => {
    window.open('/pdf/JohnGrearResume.pdf', '_blank');
    return true;
  };

  const scrollY = ref(0);

  const handleScroll = () => (scrollY.value = window.scrollY);

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<template>
  <Menubar
    class="mb-25 sticky top-0 !w-full"
    :class="{
      'h-23': scrollY == 0,
      'h-15': scrollY > 0,
    }"
  >
    <template #start>
      <RouterLink to="/" class="!font-bold">My Portfolio</RouterLink>

      <Image
        :src="johnJpeg"
        alt="John Grear"
        class="absolute left-1/2 top-5 -translate-x-1/2 select-none transition-all duration-300 hover:scale-110"
        :class="{
          'size-35': scrollY < 10,
          '-translate-30 size-0': scrollY >= 10,
        }"
        :pt="{
          image: { class: '!rounded-full' },
        }"
      />
    </template>

    <template #end>
      <div class="flex gap-5">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="!link.click ? link.to : ''"
          class="!font-bold"
          @click="link.click"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </template>
  </Menubar>
</template>
