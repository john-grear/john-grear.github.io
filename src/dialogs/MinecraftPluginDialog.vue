<script setup lang="ts">
  import { useDialogService } from '@/services/useDialogService';

  import endershiftTestingMp4 from '@/assets/images/endershift_testing.mp4';

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
    <p>{{ data.shortDescription }}</p>

    <p>
      This was my first set of projects that I worked on. I started working on these as I started
      college. I would use things that I was learning in my classes. I started in Java but later
      swapped to using Kotlin after I gained more proficiency.
    </p>

    <p>
      The code is obviously old and not to my current standards; I didn't even use git for my
      earlier plugins. That being said I did record this short demo of my Ender Shift plugin below.
    </p>

    <Tabs value="0" class="w-full">
      <TabList>
        <Tab value="0">Ender Shift</Tab>
        <Tab value="1">Pandamonium Crates</Tab>
        <Tab value="2">Pandamonium Games</Tab>
        <Tab value="3">Dungeon Maze</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0" class="flex flex-col items-center">
          <p>
            Tracks the placement of item frames and ender pearls being placed inside them. If four
            are placed on any side of an obsidian block, that block position gets stored in a yml
            file. When the player shifts on any of these shift points, any available shift points
            within a certain number of blocks will have a frozen, glowing enderman spawn on them.
            Punching in there direction will teleport to the shift point tied to them. If there is a
            shift point directly above or below the player, they can jump or shift (respectively) to
            immediately move to the shift points in that direction.
          </p>
          <br />

          <p>
            Inspired by the Elevator and Travel Anchor blocks from the OpenBlocks and Ender IO mods
            respectively.
          </p>
          <br />

          <video :src="endershiftTestingMp4" class="max-w-150 w-[80%]" controls>
            <p>Your browser doesn't support HTML video. What browser are you using?</p>
          </video>
        </TabPanel>
        <TabPanel value="1">
          <p>
            <a href="https://github.com/john-grear/pandamonium-crates" target="_blank">
              Pandamonium Crates
            </a>
            - This is a standard crates plugin. Created a custom crate key item that can be given by
            a command or through daily rewards. There is also a command to create new crates, change
            rewards and rates, etc. Everything is also configurable through a GUI in game or yml
            files.
          </p>
        </TabPanel>
        <TabPanel value="2">
          <p>
            <a href="https://github.com/john-grear/pandamonium-games" target="_blank">
              Pandamonium Games
            </a>
            - Started working on a base game plugin that could facilitate the common functionalities
            of most games (scoreboards, teams, points, etc.), while using that to make certain games
            like HideAndSeek, PantyRaid (capture the flag but with armor on an armor stand), and a
            fighting game with different classes. None of these worked out, but it was an attempt.
          </p>
        </TabPanel>
        <TabPanel value="3">
          <p>
            <a href="https://github.com/john-grear/dungeon-maze" target="_blank">Dungeon Maze</a>
            - Takes an area, parses all preplaced blocks and applies different effects like
            regeneration, traps that automatically reset, prevents block breaking and placing (apart
            from light sources that break after 2 minutes) inside the maze, gives rewards at the
            end, enables a hard mode after initial completion, and takes you back to your spawnpoint
            after clicking a button to complete the maze.
          </p>
          <br />

          <p>
            Hardcore mode made things minorly more difficult. My intention was to add maze
            generation so it wouldn't have to be preplaced, but got busy with classes and never came
            back to this.
          </p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </DialogCard>
</template>

<style lang="css" scoped>
  ::v-deep(.p-tab) {
    white-space: unset;
  }

  ::v-deep(.p-tablist-tab-list) {
    position: static;
  }
</style>
