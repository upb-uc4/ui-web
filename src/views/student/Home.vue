<template>
  <div>
    <dev-nav-bar></dev-nav-bar>
    <div class="mt-32 text-4xl text-center font-semibold text-gray-900">Available Courses</div>
    <div class="mt-8 flex justify-center">
      <Suspense>
      <course-list :courses="{courses}"></course-list>
      </Suspense>
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
  data: () => ({
  }),
	beforeRouteEnter(_from, _to, next) {
		const myRole = store.state.myRole;
		if (myRole != Role.STUDENT) {
			next("/redirect");
		}
		next();
	},
};
</script>
