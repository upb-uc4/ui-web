<template>
	<div class="w-full max-w-4xl">
		<div class="flex">
			<div class="container w-full flex justify-center py-4 pr-4"
            v-bind:class="{'mb-6 rounded-lg':message === '', 'shadow-none rounded-t-lg':message != ''}" > 
                <input class="flex-auto h-8 text-xl  pl-6 outline-none" 
                placeholder="Filter by name.." v-model="message">
                <i class="fas fa-search flex-right pt-2 pr-2 bg-white text-gray-600"></i>
            </div>
			<router-link to="/createCourse">
			<button
				class="bg-green-500 text-white text-center px-3 py-2 mr-8 shadow-lg border-gray-300 mb-6 rounded-lg focus:outline-none font-semibold"
			>Create course</button>
			</router-link>
		</div>
		<suspense>
			<template #default>
				<courseList></courseList>
			</template>
			<template #fallback>
				<p class="text-center text-lg pt-20">
				Loading Courses...
				</p>
			</template>
		</suspense>
	</div>
</template>

<script lang="ts">
import CourseList from "./CourseList.vue"

export default {
  name: "LecturerCourseList",
  components: {
	CourseList,
  },
  data() {
	return {
		message: "",
	}
  },
};
</script>