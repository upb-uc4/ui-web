<template>
  <section class="w-full pt-5 px-20 py-20 flex items-center justify-center">
    <div class="w-full container items-center justify-center">
      <h2 class="p-10 text-4xl font-semibold text-gray-900 text-center">Create A New Course</h2>
      <div class="w-full flex justify-center items-center">
        <div
          class="w-4/5 bg-white items-center justify-center rounded-lg rounded-r-none shadow-xl py-4 px-8"
        >
          <CourseGeneralInformation
            v-model:type="course.courseType"
            v-model:courseName="course.courseName"
            v-model:lecturerId="course.lecturerId"
            v-model:ects="course.ects"
          />
          <CourseRestriction v-model:maxStudents="course.maxStudents" />
          <CourseDescription v-model:description="course.description" />
          <div class="flex items-center justify-center">
            <button
              class="bg-white text-blue-600 border-2 shadow-md border-gray-300 py-2 px-8 rounded-lg focus:outline-none font-semibold"
              @click="handleSubmit"
            >Create Course</button>
          </div>
          <div v-if="error" class="items-center justify-center">
          <h2  class="text-xl font-semibold text-red-500 text-center">Please check your inputs!</h2>
          <p  class="text-m font-semibold text-red-500 text-center">Errors in: {{ collectedErrors }}</p>
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

let course = new Course();
export default {
  name: "Lecturer.CreateCourseForm",
  components: {
    CourseGeneralInformation,
    CourseRestriction,
    CourseDescription
  },
  data() {
    return {
      course: course,
      error: false,
      success: false,
      collectedErrors: ""
    };
  },

  methods: {
    test() {
      console.log(this.course);
    },

    handleSubmit() {
      console.log(this.course)
      this.collectedErrors = "";
      if (this.course.courseName == "" || this.course.courseName == undefined) {
        this.error = true;
        this.collectedErrors+= "\t(Course Name)\t";
      }
      if (this.course.lecturerId == 0n || this.course.lecturerId == undefined) {
        this.error = true;
        this.collectedErrors+= "\t(Lecturer ID)\t";
      }
      if(this.course.ects == 0n || this.course.ects == undefined) {
        this.error = true;
        this.collectedErrors+= "\t(ECTS)\t";
      }
      if(this.course.maxStudents == 0n || this.course.maxStudents == undefined) {
        this.error = true;
        this.collectedErrors+= "(Participant Limit)";
      }

      if(this.error) {
        return;
      }
      else {
        this.submitForm();
        this.error=false;
        this.collectedErrors="";
      }
    },

    submitForm() {
      //TODO
      //generate a random course ID
      const random = require('random-bigint')
      this.course.courseId = random(128)
      return
    }
  }
};
</script>
