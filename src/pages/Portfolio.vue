<script setup lang="ts">
  import BGSUApplicationDialog from '@/dialogs/BGSUApplicationDialog.vue';
  import DungeonsOfDoomDialog from '@/dialogs/DungeonsOfDoomDialog.vue';
  import MegaManPluginDialog from '@/dialogs/MegaManPluginDialog.vue';
  import MinecraftPluginDialog from '@/dialogs/MinecraftPluginDialog.vue';

  import bgsuInternshipPng from '@/assets/images/bgsu-icon.png';
  import dungeonsOfDoomJpg from '@/assets/images/dungeons-of-doom.jpg';
  import megamanJumpPng from '@/assets/images/mega-man-jump.png';
  import minecraftIcon from '@/assets/images/minecraft-icon.png';
</script>

<template>
  <Header
    header="John Grear"
    subheader="Graduate of Bowling Green State University, working at GROB Systems Inc."
  />

  <ProjectCard
    header="Mega Man Vue Plugin"
    start-date="2025"
    end-date="Current"
    :tools="['Vue', 'PrimeVue', 'HTML', 'TS', 'CSS', 'Tailwind']"
    short-description="Vue plugin that adds a Mega Man sprite to the page, enables movement, animations, and a fully functional Mega Man game on any page it's added to."
    :image="megamanJumpPng"
    git-link="https://github.com/john-grear/mega-man-html-plugin"
    :details-dialog="MegaManPluginDialog"
  />

  <ProjectCard
    header="BGSU Internship / Mentorship Application"
    start-date="Spring 2023"
    :tools="['Laravel', 'PHP', 'SQLite']"
    short-description="Group project for my capstone course at BGSU to clean up existing project and prepare it for use by BGSU's internship/mentorship team."
    :image="bgsuInternshipPng"
    :details-dialog="BGSUApplicationDialog"
  />

  <ProjectCard
    header="Dungeons of Doom"
    start-date="2022"
    :tools="['Kotlin', 'Android']"
    short-description="Group project for my Usability Engineering course at BGSU focusing on increasing usability instead of completing functionality."
    :image="dungeonsOfDoomJpg"
    git-link="https://gitlab.com/jgrear/dungeonsofdoom"
    :details-dialog="DungeonsOfDoomDialog"
  />

  <ProjectCard
    header="Minecraft Plugins"
    start-date="2019"
    end-date="2022"
    :tools="['Java', 'Kotlin']"
    short-description="Java / Kotlin plugins to enhance the experience of the Minecraft server I ran while learning to code."
    :image="minecraftIcon"
    :details-dialog="MinecraftPluginDialog"
  />
</template>
