<template>
    <div>
        <div v-for="course in courses" :key="course.courseId">
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
import CourseManagement from "@/api/CourseManagement";
// eslint-disable-next-line no-unused-vars
import { Course } from "@/entities/Course"
import ICourse from '@/api/api_models/course_management/ICourse';

export default {
    name: "CourseList",
    components: {
        LecturerCourse,
        StudentCourse,
    },
    
    async setup() {
        let courses: ICourse[] = [];
        let role = store.state.myRole;
        let roles = Object.values(Role).filter(e => e != Role.NONE);
        let isLecturer: boolean = (role == Role.LECTURER);
        let isStudent: boolean = (role == Role.STUDENT);
        let courseManagement: CourseManagement = new CourseManagement();
        let myId = store.state.myId;

        await course_management.getCourses().then((response : ICourse[]) => {
            courses = response;
        })
        
        if(isLecturer) {
            courses = courses.filter(course => course.lecturerId == myId);
        }

        return {
            role,
            roles, 
            myId, 
            courses, 
            isLecturer, 
            isStudent
        }
    }
    
}
</script>