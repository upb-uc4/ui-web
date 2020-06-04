<template>
  <section class="w-full pt-5 px-20 py-20 flex items-center justify-center">
    <div class="w-full container items-center justify-center">
      <h2 class="p-10 text-4xl font-semibold text-gray-900 text-center">Create A New Course</h2>
      <div class="w-full flex justify-center items-center">
      <div class="w-4/5 bg-white items-center justify-center rounded-lg rounded-r-none shadow-xl py-4 px-8">
            <CourseGeneralInformation 
            v-model:type="course.courseType"
            v-model:courseName="course.courseName"
            v-model:lecturerId="course.lecturerId"
            v-model:ects="course.ects"
            <CourseRestriction 
          <CourseRestriction v-model:maxStudents="course.maxStudents" />
            <CourseDescription 
            v-model:description="course.description"/>
            <div class="flex items-center justify-center">
 
                <button
                  class="bg-white text-blue-600 border-2 shadow-md border-gray-300 py-2 px-8 rounded-lg focus:outline-none font-semibold"
                  @click="test()"
                >Create Course</button>
        </div>
      </div>
      </div>
    </div>

  </section>
</template>

<script lang="ts">
import CourseGeneralInformation from "../../components/CourseGeneralInformation.vue";
import CourseRestriction from "../../components/CourseRestrictions.vue";
import CourseDescription from "../../components/CourseDescription.vue";
import { Course } from "../../entities/Course";

export default {
  name: "Lecturer.CreateCourseForm",
  components: {
    CourseGeneralInformation,
    CourseRestriction,
    CourseDescription
  },
  data() {
    return {
        course: Course,
    }
  },

  methods: {
    test() {
      console.log(this.course);
    }
  }
};
</script>
