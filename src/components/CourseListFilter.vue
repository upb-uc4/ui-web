<template>
    <div class="w-full max-w-4xl">
        <input class="mb-6 w-4/6 h-8 text-xl rounded-lg pl-8 shadow-xl" placeholder="Filter by name.." v-model="message">
        <p hidden>{{ filteredCourses }}</p>
    </div>
</template>

<script lang="ts">
    export default {
        name: "CourseListFilter",
        components: {
        },
        props: [
            'courses'
        ],
        data: function () {
            return {
                message: ""
            };
        },
        computed: {
            // filtered courses
            filteredCourses: function() : object[] {
                if(this.message == "") {
                    this.$emit('filter', this.courses);
                    return this.courses;
                }
                const filteredCourses = this.courses.filter((course: {name: string}) => course.name.toLowerCase().includes(this.message.toLowerCase()));

                this.$emit('filter', filteredCourses);
                return filteredCourses;
            }
        }, 
        methods: {
            send: function() {
                
            }
        }
    };
</script>