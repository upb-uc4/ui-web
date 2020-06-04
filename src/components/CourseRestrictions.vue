<template>
  <div>
    <div class="text-l text-left font-semibold text-gray-700">Course Restrictions</div>
    <hr class="border-0 bg-gray-700 text-gray-700 h-px" />
    <div class="pt-5">
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-gray-900 font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="inline-username"
          >Participant Limit</label>
        </div>
        <!--<select
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 "
        >
          <option>unlimited</option>
          <option>50</option>
          <option>75</option>
          <option>100</option>
          <option>150</option>
          <option>200</option>
          <option>Custom</option>
        </select>
        -->
        <div class="md:w-2/3">
          <input
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/6 py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            type="text"
            :value="maxStudents"
            @input="updateParticipantLimit($event.target.value)"
            placeholder="Limit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Course.Restrictions",
  props: {
    participantLimit: String
  },

  setup(props, { emit }) {
    const updateParticipantLimit = value => {
      emit("update:participantLimit", value);
    };
    return {updateParticipantLimit};
  }
};
</script>