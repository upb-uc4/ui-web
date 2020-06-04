<template>
  <div>
    <div class="mt-32 text-4xl text-center font-semibold text-gray-900">Available Courses</div>
    <div class="mt-8 flex justify-center">
      <course-list :courses="courses"></course-list>
    </div>
  </div>
</template>

<script lang="ts">
import CourseList from "../../components/StudentCourseList.vue";
import { onMounted } from "vue";

export default {
  name: "Student.Home",
  components: {
    CourseList
  },
  setup() {
    var courses = {}
    onMounted(() => {
      const axios = require("axios");
      const instance = axios.create({
        baseURL: "http://192.168.0.143:9000",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json;charset=UTF-8"
        }
      });

      instance
        .get("/course")
        .then(function(response) {
          console.log(response);
          courses=response.data
          console.log(courses)
        })
        .catch(function(error: object) {
          console.log(error);
        });
    });
    return {
        courses
    }
  },
  data: () => ({
  })
};
</script>
