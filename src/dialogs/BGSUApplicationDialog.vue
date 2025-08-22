<script setup lang="ts">
  import { useDialogService } from '@/services/useDialogService';

  import bgsuInternshipMainPageImage from '@/assets/images/bgsu-internship-main-page.png';
  import bgsuInternshipStudentPageImage from '@/assets/images/bgsu-internship-student-page.png';

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
    <SimpleCard>
      <p>{{ data.shortDescription }}</p>
    </SimpleCard>

    <Image
      class="!h-50 select-none self-center object-contain"
      :src="bgsuInternshipMainPageImage"
      image-class="rounded-xl"
      preview
    />

    <SimpleCard class="flex flex-col gap-4">
      <p>
        Our main task for this was to take the existing web app made in Laravel 5 and bring it up to
        date (at the time) to Laravel 10, clean up the code, fix bugs, and add features. The
        previous web app was made in another capstone course years earlier by people who were not
        keen of frontend development. I spent a lot of this project improving UI and fixing issues
        that were created in the past while still working on my own set of additions to this.
      </p>

      <i>I don't have access to the code as this was created for BGSU.</i>
    </SimpleCard>

    <Image
      class="!h-50 select-none self-center object-contain"
      :src="bgsuInternshipStudentPageImage"
      image-class="rounded-xl"
      preview
    />
  </DialogCard>
</template>
