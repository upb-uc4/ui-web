<template>
    <div>
        <h1>{{ course }}</h1>
        
    </div>
</template>

<script lang="ts">

import  {Course}  from '../entities/Course'

const axios = require("axios");

    export default {
        name: "Test",
        props: ['editMode'],
        data () {
            return {
                course: new Course(), 

            }
        },
        methods: {
            loadCourse () {
                axios.get("http://localhost:9000/course/findByCourseId?id=" + this.$route.params.id)
                .then((response: any) => {
                    this.course = response.data
                })
                .catch((error: any) => {
                    console.error(error)
                })
            }
        },
        mounted() {
            this.loadCourse()
            
            
        } 
    }
   
</script>