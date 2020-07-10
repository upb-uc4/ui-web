<template>
    <div class="w-full lg:mt-16 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="back" class="flex items-center mb-4 navigation-link">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>
        <div class="flex items-center bg-white rounded-lg mt-12">
            <div class="flex items-center my-12">
                <img class="w-32 h-32 mb-4 rounded-full object-cover mx-16 border-4 border-blue-700"
                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRsZsJ3BZuN_DlUM3OBlxrb43heJhRAXhQ9_w&usqp=CAU">
                <div class="flex flex-col">
                    <h1 class="text-3xl font-medium text-gray-700">{{ student.firstName + " " + student.lastName }}</h1>
                    <h2 class="text-xl font-medium text-gray-700">@{{ student.username }}</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Router from "@/router";
    import Student from "@/api/api_models/user_management/Student";

    export default {
        props: {
            student: {
                required: true,
                type: Object as () => Student,
            }
        },
        setup() {
            function back() {
                Router.back();
            }
            return {back}
        }
    }
</script>