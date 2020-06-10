<template>
  <div class="flex shadow-xl bg-white rounded-lg">
    <div class="w-2/3 py-4 px-8">
      <div class="flex">
        <div class="w-full">
          <div class="flex items-baseline">
            <span
              class="inline-block bg-teal-200 text-teal-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide"
            >{{ course.courseType }}</span>
            <div
              class="ml-4 text-gray-600 text-xs uppercase font-semibold tracking-wide"
            >{{ course.language }}</div>
            <div
              class="ml-4 text-gray-600 text-xs uppercase font-semibold tracking-wide"
            >{{ course.ects }} ECTS</div>
            <div class="ml-4 text-gray-600 text-xs uppercase font-semibold tracking-wide">
              <i class="inline fas fa-users text-lg"></i>
              {{ course.currentParticipants}} / {{ course.maxStudents }}
            </div>
          </div>
          <div
            class="mt-2 font-semibold text-2xl leading-tight truncate text-gray-900"
          >{{ course.courseName }}</div>
          <div class="mt-1 font-semibold text-sm text-gray-600">{{ course.lecturerId }}</div>
          <div class="mt-3 w-5/6">
            <read-more
              more-str="Show more"
              :text="course.description"
              less-str="Show less"
              :max-chars="180"
            ></read-more>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/3 pl-4 pr-8 flex justify-end items-center">
      <button class="w-full md:w-1/2 bg-gray-600 text-white text-center py-2 rounded-lg font-semibold"
      @click="editCourse()">
          Edit
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import ReadMore from "./ReadMore.vue";
import router from '../router';
export default {
  name: "Course",
  props: ["course"],
  components: {
    ReadMore
  },
  data: () => ({
    less: '<span class="text-blue-900">less</span>',
    }),
  
  methods: {
    editCourse() {
      router.push({path: "/test/"+this.course.courseId})
    }
  }
}

</script>