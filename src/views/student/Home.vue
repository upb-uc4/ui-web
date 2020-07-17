<template>
	<div>
		<dev-nav-bar/>
		<div class="mt-32 text-4xl text-center font-semibold text-gray-900">Available Courses</div>
		<div class="mt-8 flex justify-center">
			<course-list/>
		</div>
	</div>
</template>

<script lang="ts">
	import CourseList from "../../components/StudentCourseList.vue";
	import DevNavBar from "../../components/dev_components/DevNavBar.vue"
	import { store } from "../../store/store"
	import { Role } from "../../entities/Role"

	export default {
		name: "Student.Home",
		components: {
			CourseList,
			DevNavBar
		},
		beforeRouteEnter(_to: any, _from: any, next: any) {
			const myRole = store.state.myRole;
			if (myRole != Role.STUDENT) {
				return next("/redirect");
			}
			return next();
		},
	};
</script>
