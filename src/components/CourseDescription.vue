<template>
  <div>
    <div class="text-l text-left font-semibold text-gray-700">Course Desciptons</div>
    <hr class="border-0 bg-gray-700 text-gray-700 h-px" />
    <div class="p-5">
      <div class="md:flex md:items-start mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="inline-username"
          >Participant Limit</label>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full px-3">
            <textarea
              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 resize-none"
            >(Optional)</textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Course.Description"
};
</script>