<template>
  <div>
    <section class="pt-16 flex items-center justify-center bg-gray-100">
      <div class="container">
        <div>
          <h1 class="text-5xl font-bold text-gray-900 text-center">
            Choose Your Role
          </h1>
        </div>
        <div class="md:flex w-full h-screen">
          <div
            class="md:w-1/2 bg-red-300 text-gray-900 flex items-center justify-center cursor-pointer hover:bg-red-500"
            @click="goto('/student')"
          >
            <h1 class="text-6xl">Student</h1>
          </div>

          <div
            class="md:w-1/2 bg-blue-300 text-gray-900 flex flex-col items-center justify-center cursor-pointer"
          >
            <h1 class="text-6xl p-5 ">Lecturer</h1>
            <input
              class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-1/2 py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              type="text"
              @input="updateLecturerId($event.target.value)"
              placeholder="Please provide your Lecturer-ID"
            />
          <div class="p-5">
            <button
              class="bg-white text-blue-600 border-2 shadow-md border-gray-300 py-2 px-8 rounded-lg focus:outline-none font-semibold" @click="enterProf()"
            >Enter</button>
          </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Router from "../../router/";
export default {
  name: "Login",
  data()  {
      return {
      lecturerId: -1
      }
  },
  methods: {
    goto: function(target: string) {
      Router.push(target);
    },
    updateLecturerId: function(value:string) {
        this.lecturerId = value;
        console.log(this.lecturerId)
    },
    enterProf: function() {
        if(this.lecturerId == -1 || this.lecturerId == "") {
            console.log("Error: lecturerId not set")
            return
        }
        else {
            //TODO add lecturerId to the vuex store
            this.goto("/lecturer")
            return
        }
    } 
  },
};
</script>
