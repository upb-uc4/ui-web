<template>
  <div class="w-full max-w-4xl">
    <div class="flex">
      <course-list-filter :courses="courses" @filter="filter"></course-list-filter>
      <router-link to="/createCourse">
        <button
          class="bg-green-500 text-white text-center border-2 shadow-md border-gray-300 mb-6 rounded-lg focus:outline-none font-semibold"
        >Create a new course</button>
      </router-link>
    </div>

    <div v-for="course in filteredCourses" :key="course.name">
      <course :course="course" class="mb-8"></course>
    </div>
  </div>
</template>

<script lang="ts">
import Course from "./LecturerCourse.vue";
import CourseListFilter from "./CourseListFilter.vue";
export default {
  name: "CourseList",
  components: {
    Course,
    CourseListFilter
  },
  props: ["courses"],
  data: function(): { filteredCourses: object } {
    return {
      filteredCourses: { ...this.courses }
    };
  },
  methods: {
    filter: function(value: object[]) {
      this.filteredCourses = value;
      console.log(this.filteredCourses);
    }
  }
};
</script>