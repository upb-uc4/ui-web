<template>
  <div>
    <dev-nav-bar></dev-nav-bar>
    <div class="mt-32 text-4xl text-center font-semibold text-gray-900">My Courses</div>
    <div class="mt-8 flex justify-center">
      <Suspense>
        <course-list :courses="{courses}"></course-list>
      </Suspense>
    </div>
    
  </div>
</template>

<script lang="ts">
import CourseList from "../../components/LecturerCourseList.vue";
import { useStore } from "../../store/store"
import DevNavBar from "../../components/dev_components/DevNavBar.vue"

export default {
  name: "Lecturer.Home",
  components: {
    CourseList,
    DevNavBar
  },
  setup() {
    const store = useStore();
    console.log(store.state.myRole);
  },
  data: () => ({
  })
};
</script>
