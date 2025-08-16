<script setup lang="ts">
  import grobImage from '@/assets/images/grob.svg';
  import mcalearGroupImage from '@/assets/images/mcalear-group.png';
  import velTechImage from '@/assets/images/velocity-technologies.png';
  import wsuImage from '@/assets/images/wright-state.png';
</script>

<template>
  <Header header="Experience" subheader="Currently working at GROB Systems Inc." />

  <br />

  <img :src="grobImage" alt="GROB Systems Inc." class="!w-100 rounded-lg" />
  <h2 class="mt-4 text-3xl font-bold">GROB Systems Inc.</h2>
  <p class="text-lg italic">IT Programmer • Dec. 2024 - Current</p>

  <CustomCard>
    <ul class="list-disc space-y-2 pl-5">
      <li>
        Building and optimizing responsive user interfaces with <strong>Vue.js</strong> and
        <strong>PrimeVue</strong>, enhancing usability and code maintainability through Vue's
        reactivity.
      </li>
      <li>
        Developing robust, maintainable backend services in <strong>C#</strong> and
        <strong>.NET Core</strong>, improving API reliability and system performance.
      </li>
      <li>
        Designing and maintaining complex relational databases in <strong>MS SQL</strong>, ensuring
        data integrity and efficient query performance.
      </li>
    </ul>
  </CustomCard>
  <br />

  <img :src="velTechImage" alt="Velocity Technologies" class="!w-100 rounded-lg" />
  <h2 class="mt-4 text-3xl font-bold">Velocity Technologies</h2>
  <p class="text-lg italic">Full Stack Software Developer Intern • Mar. 2023 - Aug. 2023</p>

  <CustomCard>
    <ul class="list-disc space-y-2 pl-5">
      <li>
        Implemented updated functionalities in <strong>Zend / Laminas PHP</strong> using
        <strong>PhpStorm</strong>.
      </li>
      <li>
        Structured MVC software architecture for efficient integration with
        <strong>MySQL</strong> databases.
      </li>
      <li>
        Configured technology to client request for <strong>Apache2</strong> sites and
        <strong>Edgio CDN</strong>.
      </li>
      <li>
        Developed fulfillment service app for real time product distribution using
        <strong>Shopify APIs</strong>.
      </li>
    </ul>
  </CustomCard>
  <br />

  <img :src="mcalearGroupImage" alt="McAlear Group" class="!w-100 rounded-lg" />
  <h2 class="mt-4 text-3xl font-bold">McAlear Group</h2>
  <p class="text-lg italic">Software Developer Intern • Aug. 2022 - Dec. 2022</p>

  <CustomCard>
    <ul class="list-disc space-y-2 pl-5">
      <li>Performed testing to locate defects from Jira tickets to improve usability.</li>
      <li>
        Created a new API using <strong>C#</strong> and <strong>.NET Framework</strong> to
        consolidate existing and new functionality.
      </li>
      <li>Documented all functionality that was updated in Confluence.</li>
    </ul>
  </CustomCard>
  <br />

  <img :src="wsuImage" alt="Wright State University" class="!w-100 rounded-lg" />
  <h2 class="mt-4 text-3xl font-bold">Wright State University</h2>
  <p class="text-lg italic">Teaching Assistant • Jan 2020 – Apr 2021</p>

  <CustomCard>
    <ul class="list-disc space-y-2 pl-5">
      <li>
        Guided students through <strong>Java</strong> project development, improving project quality
        and coding standards.
      </li>
      <li>
        Designed tailored lesson plans and debugging workshops based on individual student needs.
      </li>
    </ul>
  </CustomCard>
</template>
