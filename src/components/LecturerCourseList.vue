<template>
	<div class="w-full max-w-4xl">
		<div class="flex">
			<course-list-filter :courses="courses" @filter="filter"/>
		</div>

		<div class="mt-8" v-for="course in filteredCourses" :key="course.courseName">
			<lecturer-course :course="course" class="mb-8"></lecturer-course>
		</div>

		<div class="flex justify-center mt-16">
			<router-link to="/createCourse">
				<button class="px-4 btn btn-green-primary-500">New Course</button>
			</router-link>
		</div>

	</div>
</template>

<script lang="ts">
import LecturerCourse from "./LecturerCourse.vue";
import CourseListFilter from "./CourseListFilter.vue";
import { Course } from "../entities/Course"
import { useStore } from "../store/store"
//import Router from "@/router/";

export default {
  name: "CourseList",
  components: {
	LecturerCourse,
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
		const myId = store.state.myId;

		// var courses = await instance
		// 	.get("/course/findByLecturerID", +myId)
		// 	.then((response: any) => {
		// 			return response.data
		// 	})

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

		courses = courses.filter(course => course.lecturerId == myId);
		return {
			courses	
		}
	},
	data: function(): { filteredCourses: object } {
		
		return {
			filteredCourses: {...this.courses}
		};
  },
	methods: {
		filter: function(value: object[]) {
			this.filteredCourses = value;
			console.log(this.filteredCourses);
		}
	}
};
</script>