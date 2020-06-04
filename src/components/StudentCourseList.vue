<template>
    <div class="w-full max-w-4xl">
        <course-list-filter :courses="courses" @filter="filter"></course-list-filter>
        <div v-for="course in filteredCourses" :key="course.name">
            <student-course :course="course" class="mb-8"></student-course>
        </div>
    </div>
</template>

<script lang="ts">
    import StudentCourse from "./StudentCourse.vue";
    import CourseListFilter from "./CourseListFilter.vue"
    import {Course} from "../entities/Course"

    export default {
        name: "CourseList",
        components: {
            StudentCourse,
            CourseListFilter
        },
        async setup() {
            const kurs : Course = new Course();
            console.log(kurs);

            const axios = require("axios");
            const instance = await axios.create({
                baseURL: "http://192.168.0.66:9000",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json;charset=UTF-8"
                }
            });

            const courses = await instance
                .get("/course")
                .then((response: any) => {
                    console.log(response);
                    return response.data
                })
            console.log("outter")
            console.log(courses)
            return {
                courses
            }
        },
        data: function() : {filteredCourses : object} {
            return {
                filteredCourses: {...this.courses}
            }
        }, 
        methods: {
            filter: function(value : object[]) {
                this.filteredCourses = value
                console.log(this.filteredCourses)
            }
        }
    }
</script>