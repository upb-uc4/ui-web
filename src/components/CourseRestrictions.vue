<template>
  <div>
    <div class="text-l text-left font-semibold text-gray-700">Course Restrictions</div>
    <hr class="border-0 bg-gray-700 text-gray-700 h-px">
    <div class="p-5">
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-username"
        >Participant Limit</label>
      </div>
      <select
        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
      >
        <option>unlimited</option>
        <option>50</option>
        <option>75</option>
        <option>100</option>
        <option>150</option>
        <option>200</option>
        <option>Custom</option>
      </select>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Course.Restrictions"
};
</script>