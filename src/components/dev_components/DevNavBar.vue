<template>
    <div>
        <ul class="flex">
            <li class="bg-blue-200 px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="goto('/login')">   
                <a>login</a>  
            </li>
            <li class="bg-blue-200 px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="goto('/student')">   
                <a>studentHome</a>
            </li>
            <li class="bg-blue-200 px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="goto('/lecturer')">   
                <a>lecturerHome</a>
            </li>
             <li class="bg-blue-200 px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="goto('/createCourse')">   
                <a>createCourse</a>  
            </li>
            <li class="bg-blue-200 px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="goto('/createAccount')">   
                 <a>createAccount</a>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Router from "../../router/";

export default {
  name: "DevNavBar",
  props: {
  },
  methods: {
      goto: function(where:string) {
          Router.push(where);
      }
  }
};
</script>