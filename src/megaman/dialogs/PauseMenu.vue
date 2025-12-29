<script setup lang="ts">
  import { useMenuStore } from '@/megaman/stores/menu';

  import ControlRow from '../components/ControlRow.vue';

  const menu = useMenuStore();
</script>

<template>
  <Dialog
    v-model:visible="menu.isOpen"
    modal
    :close-on-escape="false"
    class="bg-slate-900! w-[80%]"
  >
    <template #header>
      <h2 class="text-2xl font-bold tracking-wide">Controls</h2>
    </template>

    <template #default>
      <!-- Controls Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <!-- Movement -->
        <div class="rounded-xl bg-slate-800 p-4">
          <h3 class="mb-3 text-lg font-semibold">Movement</h3>
          <div class="space-y-2">
            <ControlRow keys="W / ↑" label="Move Up" />
            <ControlRow keys="S / ↓" label="Move Down" />
            <ControlRow keys="A / ←" label="Move Left" />
            <ControlRow keys="D / →" label="Move Right" />
          </div>
        </div>

        <!-- Actions -->
        <div class="rounded-xl bg-slate-800 p-4">
          <h3 class="mb-3 text-lg font-semibold">Actions</h3>
          <div class="space-y-2">
            <ControlRow keys="Space / Z" label="Jump" />
            <ControlRow keys="Shift / X / Left Click" label="Attack" />
            <ControlRow keys="Hold Attack" label="Charge Attack" />
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>
