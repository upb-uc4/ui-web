<template>
    <div>
        <div v-for="course in courses" :key="course.courseName">
			<lecturer-course v-if="isLecturer" :course="course"  class="mb-8"></lecturer-course>
            <student-course v-if="isStudent" :course="course"  class="mb-8"></student-course>
		</div>
    </div>
</template>

<script lang="ts">
import { store } from "../store/store"
import {Role} from "@/entities/Role"
import LecturerCourse from "./LecturerCourse.vue";
import StudentCourse from "./StudentCourse.vue";

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
        const axios = require("axios");
		const instance = await axios.create({
			baseURL: "http://localhost:9000",
			headers: {
				"Accept": "*/*",
				"Content-Type": "application/json;charset=UTF-8"
			}
		});
		
        const myId = store.state.myId;
        var courses = await instance
			.get("/course", {
				auth: {
						username: store.state.loginData.username,
						password: store.state.loginData.password
				}
			})
			.then((response: any) => {
				console.log(response);
				return response.data
			})//.catch((error : any) => {
			// 	// if (error.response.status == "401") {
			// 	// 	Router.push("/login");
			// 	// }
			// })
        if(isLecturer) {
            courses = courses.filter(course => course.lecturerId == myId);
        }
        return {
            role, myId, courses, isLecturer, isStudent
        }
    }
    
}
</script>