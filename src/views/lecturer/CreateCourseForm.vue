<template>
  <form class="mt-16 items-center justify-center">
    <div>
      <div class="p-10 text-4xl text-center font-semibold text-gray-900">Create A New Course</div>
      <CourseGeneralInformation />
      <CourseRestriction/>
      <CourseDescription/>
      <div class="md:flex md:items-center">
        <div class="md:w-1/3"></div>
        <div class="md:w-2/3">
          <button
            class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="button"
          >Create Course</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import CourseGeneralInformation from "../../components/CourseGeneralInformation";
import CourseRestriction from "../../components/CourseRestrictions";
import CourseDescription from "../../components/CourseDescription";
export default {
  name: "Lecturer.CreateCourseForm",
  components: {
    CourseGeneralInformation,
    CourseRestriction,
    CourseDescription,
  }
};
</script>
