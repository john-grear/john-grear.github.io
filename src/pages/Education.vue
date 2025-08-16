<script setup lang="ts">
  import bgsuImage from '@/assets/images/bowling-green.png';
  import wsuImage from '@/assets/images/wright-state.png';
</script>

<template>
  <Header header="Education" subheader="Bachelor of Science in Computer Science (BSCS)" />

  <br />

  <!-- Wright State University -->
  <p class="subheader font-bold">Wright State University</p>
  <img :src="wsuImage" alt="Wright State University" class="mt-4 w-[35%] rounded-lg" />

  <CustomCard>
    <p>
      My journey in higher education began at <strong>Wright State University (WSU)</strong>, where
      I spent my first two years building a strong academic and professional foundation. As a
      <strong>Computer Science Teaching Assistant</strong>, I worked closely with students to guide
      them through challenging concepts, solidifying my own knowledge while developing
      communication, mentorship, and leadership skills.
    </p>

    <p class="mt-4">
      This experience not only deepened my technical expertise but also taught me the value of
      collaboration and patience — qualities that continue to influence my approach to
      problem-solving in the tech world.
    </p>
  </CustomCard>

  <CustomCard>
    <p>
      In 2021, as in-person learning resumed following the COVID-19 pandemic, I made the decision to
      transfer to <strong>Bowling Green State University</strong> to complete my degree.
    </p>
  </CustomCard>

  <!-- Bowling Green State University -->
  <p class="subheader mt-4 font-bold">Bowling Green State University</p>
  <img :src="bgsuImage" alt="Bowling Green State University" class="w-[35%] rounded-lg" />

  <CustomCard>
    <p>
      At <strong>Bowling Green State University (BGSU)</strong>, I immersed myself in an advanced
      curriculum covering programming languages, algorithms, software engineering, and other core
      areas of computer science. I actively engaged in discussions with professors and peers,
      sharpening my problem-solving abilities and gaining real-world insights into software
      development practices.
    </p>

    <p class="mt-4">
      My time at BGSU not only refined my technical skill set but also equipped me with the
      adaptability and creativity needed to thrive in a fast-changing tech industry.
    </p>
  </CustomCard>
</template>
