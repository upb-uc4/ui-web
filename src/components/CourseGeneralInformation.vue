<template>
  <div>
    <div
      class="text-l text-left font-semibold border-solid border-black text-gray-700"
    >General Course Information</div>
    <hr class="border-0 bg-gray-700 text-gray-700 h-px" />
    <div class="pt-5">
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4">Type</label>
        </div>
        <select
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          :value="courseType"
          @input="updateCourseType($event.target.value)"
        >
          <option>Lecture</option>
          <option>Seminar</option>
        </select>
      </div>
    </div>

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4">Language</label>
      </div>
      <select
        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        :value="language"
        @input="updateLanguage($event.target.value)"
      >
        <option>English</option>
        <option>German</option>
      </select>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-full-name"
        >Course Name</label>
      </div>
      <div class="md:w-2/3">
        <input
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/2 py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          type="text"
          :value="courseName"
          @input="updateCourseName($event.target.value)"
          placeholder="Please provide a name"
        />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4">Lecturer-ID</label>
      </div>
      <div class="md:w-2/3">
        <input
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/2 py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          type="text"
          :value="lecturerId"
          @input="updateLecturerId($event.target.value)"
          placeholder="Your ID (via vuex)"
          onkeypress="return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))"
        />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4">ECTS</label>
      </div>
      <div class="md:w-2/3">
        <input
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/6 py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          type="text"
          :value="ects"
          @input="updateEcts($event.target.value)"
          placeholder="ECTS"
          onkeypress="return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Course.GeneralInformation",

  setup(props, { emit }) {
    const updateCourseType = value => {
      console.log(value);
      emit("update:courseType", value);
    };
    const updateCourseName = value => {
      emit("update:courseName", value);
    };
    const updateLecturerId = value => {
      emit("update:lecturerId", value);
    };
    const updateEcts = value => {
      emit("update:ects", value);
    };
    const updateLanguage = value => {
      emit("update:language", value);
    };
    return {
      updateCourseType,
      updateCourseName,
      updateLecturerId,
      updateEcts,
      updateLanguage
    };
  }
};
</script>