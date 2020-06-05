<template>
  <div>
    <div class="mt-32 text-4xl text-center font-semibold text-gray-900">Available Courses</div>
    <div class="mt-8 flex justify-center">
      <Suspense>
      <course-list :courses="{courses}"></course-list>
      </Suspense>
    </div>
  </div>
</template>

<script lang="ts">
import CourseList from "../../components/StudentCourseList.vue";

export default {
  name: "Student.Home",
  components: {
    CourseList
  },
  data: () => ({
  })
};
</script>
