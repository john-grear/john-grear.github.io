<script setup lang="ts">
  import { toastService } from '@/services/useToastService';

  const isMobileDevice = (): boolean => {
    if ('userAgentData' in navigator) {
      return (navigator.userAgentData as Record<string, unknown>).mobile as boolean;
    }

    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const links = [
    { to: 'https://www.linkedin.com/in/john-grear/', title: 'LinkedIn', icon: 'pi-linkedin' },
    { to: 'https://github.com/john-grear/', title: 'Github', icon: 'pi-github' },
    {
      to: 'https://discord.com/users/215837641524903937',
      title: 'Discord',
      icon: 'pi-discord',
    },
    { to: 'mailto:piquagrearj@gmail.com', title: 'Email', icon: 'pi-envelope' },
    {
      to: 'tel:19375412303',
      title: 'Phone',
      icon: 'pi-phone',
      click: (event: MouseEvent) => openPhoneToast(event),
    },
  ];

  const openPhoneToast = (event: MouseEvent) => {
    if (isMobileDevice()) return;

    event.preventDefault();
    toastService.clear();
    toastService.info('Call', '+1 (937) 541-2303', 10000);
  };
</script>

<template>
  <Menubar class="mt-10 flex !h-full !w-full flex-col">
    <template #start>
      <div class="flex !w-full flex-col items-center">
        <div class="mt-2 flex gap-3">
          <a
            v-for="link in links"
            :key="link.to"
            :href="link.to"
            target="_blank"
            rel="noopener noreferrer"
            :title="link.title"
            class="pi"
            @click="link.click?.($event)"
          >
            <Button :icon="link.icon" rounded />
          </a>
        </div>

        <div class="mt-2 flex gap-3">
          <span>John Grear</span>
          <span>•</span>
          <span>2025</span>
          <span>•</span>
          <a href="https://john-grear.github.io/">Portfolio</a>
        </div>

        <div class="mt-1">
          Powered by <a href="https://vuejs.org/" target="_blank">Vue</a> +
          <a href="https://primevue.org/" target="_blank">PrimeVue</a>
        </div>
      </div>
    </template>
  </Menubar>
</template>
