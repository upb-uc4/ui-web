<template>
    <div class="w-full lg:mt-16 mt-8 bg-gray-300 mx-auto h-screen">
        <button id="navigateBack" class="flex items-center mb-4 navigation-link" @click="back">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>
        <div class="flex items-center bg-white rounded-lg mt-12">
            <div class="flex items-center my-12">
                <img id="picture" class="w-32 h-32 mb-4 rounded-full object-cover mx-16 border-4 border-blue-700" :src="profilePicture" />
                <div class="flex flex-col">
                    <h1 class="text-3xl font-medium text-gray-700">
                        {{ student.firstName + " " + student.lastName }}
                        <span class="text-xl"> (@{{ student.username }}) </span>
                    </h1>
                    <h2 class="text-xl text-gray-700 text-blue-700 italic">{{ student.role }}</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Router from "@/use/router";
    import Student from "@/api/api_models/user_management/Student";

    export default {
        props: {
            student: {
                required: true,
                type: Object as () => Student,
            },
        },
        setup(props: any) {
            const profilePicture = process.env.VUE_APP_API_BASE_URL + "/user-management/users/" + props.student.username + "/image";
            function back() {
                Router.back();
            }
            return { back, profilePicture };
        },
    };
</script>
