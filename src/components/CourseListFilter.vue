<template>
    <div class="w-full max-w-4xl">
        <input class="mb-6 w-4/6 h-8 text-xl rounded-lg pl-8 shadow-xl" placeholder="Filter by name.." v-model="message">
        <p hidden>{{ filteredCourses }}</p>
    </div>
</template>

<script>
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
            }
        },
        computed: {
            // filtered courses
            filteredCourses: function() {
                if(this.message == "") {
                    this.$emit('filter', this.courses)
                    return this.courses
                }
                var filteredCourses = []
                

                for (var i = 0; i < this.courses.length; i++) {
                    //console.log(this.courses[i].name)
                    //console.log(this.message)
                    var courseName = this.courses[i].name.toLowerCase()
                    //console.log(courseName)
                    if (courseName.includes(this.message.toLowerCase()))
                        filteredCourses.push(this.courses[i])
                }
                
                //console.log("in")
                //console.log(filteredCourses)
                //console.log("-")
                this.$emit('filter', filteredCourses)
                return filteredCourses
            }
        }, 
        methods: {
            send: function() {
                
            }
        }
    }
</script>