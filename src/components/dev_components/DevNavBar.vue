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
            <li class="bg-blue-200 px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="goto('/user/student')">
                <a>Public Student Profile</a>
            </li>
            <li class="bg-blue-200 px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="goto('/profile')">
                <a>My Profile</a>
            </li>
            <li class="bg-blue-200 px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="goto('/user/lecturer')">
                <a>Pub. Lecturer Profile</a>
            </li>
            <li class="ml-auto bg-blue-200 px-4 py-2 hover:bg-blue-100 cursor-pointer" @click="logout()">
                <a>logOut</a>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Router from "../../router/";
import { Role } from "../../entities/Role"

export default {
  name: "DevNavBar",
  props: {
  },
  methods: {
      goto: function(where:string) {
          Router.push(where);
      },
      logout: function() {
          this.$store.state.loginData = {username:"", password:""};
          this.$store.state.myRole = Role.NONE;
          this.$store.state.myId = "";
          Router.push("/login")
      }
  }
};
</script>