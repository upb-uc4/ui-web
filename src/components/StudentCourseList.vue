<template>
    <div class="w-full max-w-4xl">
        <course-list-filter :courses="courses" @filter="filter"></course-list-filter>
        <div v-for="course in filteredCourses" :key="course.courseName">
            <student-course :course="course" class="mb-8"></student-course>
        </div>
    </div>
</template>

<script lang="ts">
    import StudentCourse from "./StudentCourse.vue";
    import CourseListFilter from "./CourseListFilter.vue"
    import {Course} from "../entities/Course"
    import Router from "@/router/";
    import { useStore } from "../store/store"

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
                baseURL: "http://localhost:9000",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json;charset=UTF-8"
                }
            });

            const store = useStore();
            const courses = await instance
                .get("/course", {
                    auth: {
                         username: store.state.loginData.username,
                         password: store.state.loginData.password
                    }
                })
                .then((response: any) => {
                    console.log(response);
                    return response.data
                }).catch((error : any) => {
                    if (error.response.status == "401") {
                        Router.push("/login");
                    }
                })
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