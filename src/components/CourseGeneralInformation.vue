<template>
  <div>
    <div class="text-l text-left font-semibold border-solid border-black text-gray-700">General Course Information</div>
    <hr class="border-0 bg-gray-700 text-gray-700 h-px">
    <div class="p-5">
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-full-name"
        >Course Name</label>
      </div>
      <div class="md:w-2/3">
        <input
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          id="inline-full-name"
          type="text"
          value="Please provide a name"
        />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-username"
        >Lecturer</label>
      </div>
      <div class="md:w-2/3">
        <input
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          id="inline-username"
          type="text"
          placeholder="Your Name (via vuex)"
        />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-username"
        >ECTS</label>
      </div>
      <select
        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
      >
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>Custom</option>
      </select>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Course.GeneralInformation"
};
</script>