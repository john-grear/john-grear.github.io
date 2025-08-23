<script setup lang="ts">
  import grobImage from '@/assets/images/grob.svg';
  import mcalearGroupImage from '@/assets/images/mcalear-group.png';
  import velTechImage from '@/assets/images/velocity-technologies.png';
  import wsuImage from '@/assets/images/wright-state.png';
</script>

<template>
  <Header header="Experience" subheader="Currently working at GROB Systems Inc." />

  <br />

  <img :src="grobImage" alt="GROB Systems Inc." />
  <p class="subheader mt-4 font-bold">GROB Systems Inc.</p>
  <p class="text-lg italic">IT Programmer • Dec. 2024 - Current</p>

  <CustomCard>
    <ul class="list-disc space-y-2 pl-5">
      <li>
        <p>
          Building and optimizing responsive user interfaces with <strong>Vue.js</strong> and
          <strong>PrimeVue</strong>, enhancing usability and code maintainability through Vue's
          reactivity.
        </p>
      </li>
      <li>
        <p>
          Developing robust, maintainable backend services in <strong>C#</strong> and
          <strong>.NET Core</strong>, improving API reliability and system performance.
        </p>
      </li>
      <li>
        <p>
          Designing and maintaining complex relational databases in <strong>MS SQL</strong>,
          ensuring data integrity and efficient query performance.
        </p>
      </li>
    </ul>
  </CustomCard>
  <br />

  <img :src="velTechImage" alt="Velocity Technologies" />
  <p class="subheader mt-4 font-bold">Velocity Technologies</p>
  <p class="text-lg italic">Full Stack Software Developer • Mar. 2023 - Aug. 2023</p>

  <CustomCard>
    <ul class="list-disc space-y-2 pl-5">
      <li>
        <p>
          Implemented updated functionalities in <strong>Zend / Laminas PHP</strong> using
          <strong>PhpStorm</strong>.
        </p>
      </li>
      <li>
        <p>
          Structured MVC software architecture for efficient integration with
          <strong>MySQL</strong> databases.
        </p>
      </li>
      <li>
        <p>
          Configured technology to client request for <strong>Apache2</strong> sites and
          <strong>Edgio CDN</strong>.
        </p>
      </li>
      <li>
        <p>
          Developed fulfillment service app for real time product distribution using
          <strong>Shopify APIs</strong>.
        </p>
      </li>
    </ul>
  </CustomCard>
  <br />

  <img :src="mcalearGroupImage" alt="McAlear Group" />
  <p class="subheader mt-4 font-bold">McAlear Group</p>
  <p class="text-lg italic">Software Developer Intern • Aug. 2022 - Dec. 2022</p>

  <CustomCard>
    <ul class="list-disc space-y-2 pl-5">
      <li>
        <p>Performed testing to locate defects from Jira tickets to improve usability.</p>
      </li>
      <li>
        <p>
          Created a new API using <strong>C#</strong> and <strong>.NET Framework</strong> to
          consolidate existing and new functionality.
        </p>
      </li>
      <li>
        <p>Documented all functionality that was updated in Confluence.</p>
      </li>
    </ul>
  </CustomCard>
  <br />

  <img :src="wsuImage" alt="Wright State University" />
  <p class="subheader mt-4 font-bold">Wright State University</p>
  <p class="text-lg italic">Teaching Assistant • Jan 2020 – Apr 2021</p>

  <CustomCard>
    <ul class="list-disc space-y-2 pl-5">
      <li>
        <p>
          Guided students through <strong>Java</strong> project development, improving project
          quality and coding standards.
        </p>
      </li>
      <li>
        <p>
          Designed tailored lesson plans and debugging workshops based on individual student needs.
        </p>
      </li>
    </ul>
  </CustomCard>
</template>

<style lang="css" scoped>
  @reference 'tailwindcss';

  img {
    @apply w-[35%] max-w-xl rounded-xl;
  }
</style>
