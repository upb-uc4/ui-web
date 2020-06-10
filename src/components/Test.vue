<template>
    <div>
        <h1>{{ course }}</h1>
        <h1>{{ localCourse.courseName }}</h1>
    </div>
</template>

<script lang="ts">
import { Course } from '../entities/Course'
    export default {
        name: "Test",
        props: ['course'],
        data () {
            return {
                localCourse: typeof Course
            }
        },
        created() {
            console.log(this.course )
            this.localCourse = JSON.parse(this.course)
        }   
    }
   
</script>