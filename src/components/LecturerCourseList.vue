<template>
	<div class="w-full max-w-4xl">
		<div class="flex">
			<course-list-filter :courses="courses" @filter="filter"></course-list-filter>
			<router-link to="/createCourse">
			<button
				class="bg-green-500 text-white text-center px-3 py-2 mr-8 shadow-lg border-gray-300 mb-6 rounded-lg focus:outline-none font-semibold"
			>Create course</button>
			</router-link>
		</div>

		<div v-for="course in filteredCourses" :key="course.courseName">
			<lecturer-course :course="course" class="mb-8"></lecturer-course>
		</div>
	</div>
</template>

<script lang="ts">
import LecturerCourse from "./LecturerCourse.vue";
import CourseListFilter from "./CourseListFilter.vue";
import { Course } from "../entities/Course"
import { useStore } from "../store/store"

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
			.get("/course")
			.then((response: any) => {
					return response.data
			})

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