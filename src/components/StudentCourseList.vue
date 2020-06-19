<template>
	<div class="w-full max-w-4xl">
		<div class="flex">
			<div class="container w-full flex justify-center py-4 pr-4"
            v-bind:class="{'mb-6 rounded-lg':message === '', 'shadow-none rounded-t-lg':message != ''}" > 
                <input class="flex-auto h-8 text-xl  pl-6 outline-none" 
                placeholder="Filter by name.." v-model="message">
                <i class="fas fa-search flex-right pt-2 pr-2 bg-white text-gray-600"></i>
            </div>
		</div>
		<suspense>
			<template #default>
				<courseList/>
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
        name: "StudentCourseList",
        components: {
            CourseList
        },
        data() {
            return {
                message: "",
            }
        },
    }
</script>