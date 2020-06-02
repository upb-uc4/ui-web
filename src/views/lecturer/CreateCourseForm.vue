<template>
  <section class="w-full pt-5 px-20 py-20 flex items-center justify-center">
    <div class="w-full container items-center justify-center">
      <h2 class="p-10 text-4xl font-semibold text-gray-900 text-center">Create A New Course</h2>
      <div class="w-full flex justify-center items-center">
      <div class="w-4/5 bg-white items-center justify-center rounded-lg rounded-r-none shadow-xl py-4 px-8">
            <CourseGeneralInformation />
            <CourseRestriction />
            <CourseDescription />
            <div class="flex items-center justify-center">
 
                <button
                  class="bg-white text-blue-600 border-2 shadow-md border-gray-300 py-2 px-8 rounded-lg focus:outline-none font-semibold"
                >Create Course</button>
        </div>
      </div>
      </div>
    </div>

  </section>
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
    CourseDescription
  }
};
</script>
