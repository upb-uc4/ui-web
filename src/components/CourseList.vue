<template>
    <div>
        <div v-for="course in courses" :key="course.courseName">
			<lecturer-course v-if="isLecturer" :course="course"  class="mb-8"/>
            <student-course v-if="isStudent" :course="course"  class="mb-8"/>
		</div>
    </div>
</template>

<script lang="ts">
import { store } from "../store/store"
import { Role } from "@/entities/Role"
import LecturerCourse from "./LecturerCourse.vue";
import StudentCourse from "./StudentCourse.vue";
import Course_Management from "@/api/Course_Management";
import { Course } from "@/entities/Course"

export default {
    name: "CourseList",
    components: {
        LecturerCourse,
        StudentCourse,
    },
    data() {
        return {
            roles: Object.values(Role).filter(e => e != Role.NONE),
        }
    },
    async setup() {
        const role = store.state.myRole;
        
        const isLecturer: boolean = (role == Role.LECTURER);
        const isStudent: boolean = (role == Role.STUDENT);

        const course_management: Course_Management = new Course_Management();

        var courses: Course[] = [];
        console.log(Course);

        await course_management.getCourses().then((response : Course[]) => {
            courses = response;
        })
        
        const myId = store.state.myId;
        if(isLecturer) {
            courses = courses.filter(course => course.lecturerId == myId);
        }

        return {
            role, myId, courses, isLecturer, isStudent
        }
    }
    
}
</script>