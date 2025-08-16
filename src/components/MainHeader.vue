<script setup lang="ts">
  import { router } from '@/router';
  import { useIsSmallWindow } from '@/services/useIsSmallWindow';

  import { onMounted, onUnmounted, ref } from 'vue';
  import { RouterLink } from 'vue-router';

  import johnJpeg from '@/assets/images/john.jpeg';

  const links = [
    { to: '/about', icon: 'pi pi-user', label: 'About Me' },
    { to: '/education', icon: 'pi pi-graduation-cap', label: 'Education' },
    { to: '/experience', icon: 'pi pi-briefcase', label: 'Experience' },
    { to: '/resume', icon: 'pi pi-file-arrow-up', label: 'Resume', click: () => openResume() },
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

  const { isSmallWindow } = useIsSmallWindow(1300);

  const menu = ref();
  const items = ref(
    links.map((link) => ({
      icon: link.icon,
      label: link.label,
      command: () => {
        if (link.click) {
          link.click();
        } else {
          router.push(link.to);
        }
      },
    }))
  );

  const toggle = (event: Event) => {
    menu.value.toggle(event);
  };

  const isCurrentRoute = (route: string) => {
    return router.currentRoute.value.name?.toString().toLowerCase() == route.toLowerCase();
  };
</script>

<template>
  <Menubar class="mb-25 h-15 sticky top-0 !w-full">
    <template #start>
      <RouterLink to="/" class="p-button p-component p-button-text font-bold">
        <i class="pi pi-address-book" />
        Portfolio
      </RouterLink>

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
      <div v-if="!isSmallWindow" class="flex">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="!link.click ? link.to : ''"
          class="p-button p-component font-bold"
          :class="{ 'p-button-text': !isCurrentRoute(link.to) }"
          @click="link.click"
        >
          <i :class="link.icon" />
          {{ link.label }}
        </RouterLink>
      </div>
      <div v-else class="flex">
        <Button
          type="button"
          icon="pi pi-bars"
          variant="text"
          @click="toggle"
          aria-haspopup="true"
          aria-controls="overlay_menu"
        />
        <Menu
          ref="menu"
          id="overlay_menu"
          :model="items"
          :popup="true"
          :pt="{
            root: {
              class: '!min-w-0',
            },
            itemLink: {
              class: 'p-button-text',
              style: { color: 'var(--p-button-text-primary-color)' },
            },
            itemIcon: {
              style: { color: 'var(--p-button-text-primary-color)' },
            },
          }"
        />
      </div>
    </template>
  </Menubar>
</template>
