<template>
  <section class="w-full pt-5 px-20 py-20 flex items-center justify-center">
    <div class="w-full container items-center justify-center">
      <h2 class="p-10 text-4xl font-semibold text-gray-900 text-center">Create A New Course</h2>
      <div class="w-full flex justify-center items-center">
        <div
          class="w-4/5 bg-white items-center justify-center rounded-lg rounded-r-none shadow-xl py-4 px-8"
        >
          <CourseGeneralInformation
            v-model:courseType="course.courseType"
            v-model:courseName="course.courseName"
            v-model:lecturerId="course.lecturerId"
            v-model:ects="course.ects"
            v-model:language="course.language"
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
import { store } from '../../store/store';

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
  setup () {
    course.lecturerId = store.state.myId
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
      if (this.course.lecturerId == 0 || this.course.lecturerId == undefined) {
        this.error = true;
        this.collectedErrors+= "\t(Lecturer ID)\t";
      }
      if(this.course.ects == 0 || this.course.ects == undefined) {
        this.error = true;
        this.collectedErrors+= "\t(ECTS)\t";
      }
      if(this.course.maxStudents == 0 || this.course.maxStudents == undefined) {
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
      //generate a random course ID
      this.course.courseId = Math.floor(Math.random() * Math.floor(30000));

      const axios = require("axios");
      const instance =  axios.create({
        baseURL: "http://localhost:9000",
          headers: {
            "Accept": "*/*",
            "Content-Type": "application/json;charset=UTF-8"
          }
      });

      instance.post("/course", this.course).then((response: any) => {
        console.log(response);
      });

      return
    }
  }
};
</script>
