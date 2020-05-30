<template>
  <form class="items-center justify-center pt-5 px-20 py-20">
    <div>
      <div class="p-10 text-4xl text-center font-semibold text-gray-900">Create A New Course</div>
      <CourseGeneralInformation/>
      <CourseRestriction/>
      <CourseDescription/>
      <div class="md:flex md:items-center">
        <div class="md:w-1/3"></div>
        <div class="md:w-2/3">
         <button class="bg-white text-blue-600 border-2 shadow-md border-gray-300 py-2 px-8 rounded-lg focus:outline-none font-semibold">Create Course</button>
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
