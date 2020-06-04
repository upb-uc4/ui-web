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
import {onMounted} from 'vue'

export default {
    name: 'Student.Home',
    components: {
        CourseList,
    },
    setup() {
        onMounted(() => {
        const axios = require("axios");
        const instance = axios.create({
            baseURL: 'http://192.168.0.143:9000',
            timeout: 1000
        });

        instance.get('/course')
        .then(function(response: object) {
            console.log(response);
        }).catch(function(error: object){
            console.log(error);
        }).then(function(){

        });
        return;
    });
    },
    data: () => ({
        courses: [
            {
                name: "Vue.js 101",
                id: 123456789,
                type: "Seminar",
                lecturer: "Prof. Dr. Bienlein",
                language: "English",
                credits: 5,
                description: "This is a generic course description which can be quite long. " +
                    "It may consists of several paragraphs and perhaps should be shortened. " +
                    "Imagine some longer text that describes this course very well. Just imagine for a brief moment, this description is long. " +
                    "Imagine some longer text that describes this course very well. Just imagine for a brief moment, this description is long. ",
                participants: 5,
                maxParticipants: 16,
                startDate: 'Sat, 30.05.2020 [18:00]',
                endDate: 'Mo, 29.06.2020 [20:00]',
            },
           {
                name: "Tailwindcss 101",
                id: 987654321,
                type: "Lecture",
                lecturer: "Donald Duck",
                language: "German",
                credits: 6,
                description: "This is a generic course description which can be quite long. " +
                    "It may consists of several paragraphs and perhaps should be shortened. " +
                    "Imagine some longer text that describes this course very well. Just imagine for a brief moment, this description is long. " +
                    "Imagine some longer text that describes this course very well. Just imagine for a brief moment, this description is long. ",
                participants: 74,
                maxParticipants: 105,
                startDate: 'Sat, 30.05.2020 [14:00]',
                endDate: 'Sat, 27.06.2020 [14:00]',
            },
            {
                name: "JavaScript 101",
                id: 132457689,
                type: "Lecture",
                lecturer: "Darth Vader",
                language: "German",
                credits: 10,
                description: "This is a generic course description which can be quite long. " +
                    "It may consists of several paragraphs and perhaps should be shortened." +
                    "Could also include a 'click for more'.",
                participants: 200,
                maxParticipants: 200,
                startDate: 'Fr, 29.05.2020 [14:00]',
                endDate: 'Sat, 27.06.2020 [17:00]',
            },
        ],
    }),
}
</script>
