<template>
    <div class="w-full lg:mt-16 mt-8 bg-gray-300 mx-auto h-screen">
        <button id="navigateBack" class="flex items-center mb-4 navigation-link" @click="back">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>
        <div class="flex flex-col bg-white rounded-lg mt-12">
            <div class="flex items-center mt-12">
                <img id="picture" class="w-32 h-32 mb-4 rounded-full object-cover mx-16 border-4 border-blue-700" :src="profilePicture" />
                <div class="flex flex-col">
                    <h1 class="text-3xl font-medium text-gray-700">
                        {{ lecturer.firstName + " " + lecturer.lastName }}
                        <span class="text-xl"> (@{{ lecturer.username }}) </span>
                    </h1>
                    <h2 class="text-xl text-gray-700 text-blue-700 italic">{{ lecturer.role }}</h2>
                </div>
            </div>
            <div class="flex flex-col mx-64">
                <div class="w-full mr-12 flex flex-col mb-4">
                    <div class="flex mb-2 align-baseline">
                        <label class="block text-gray-700 text-lg font-medium">Research Area</label>
                    </div>
                    <label class="block text-gray-600">
                        {{ lecturer.researchArea }}
                    </label>
                </div>
                <div class="w-full lg:w-1/2 lg:block mr-12 flex flex-col mb-4">
                    <div class="flex mb-2 align-baseline">
                        <label class="block text-gray-700 text-lg font-medium">Description</label>
                    </div>
                    <label class="block text-gray-600">
                        {{ lecturer.freeText }}
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import Router from "@/use/router";

    export default {
        props: {
            lecturer: {
                required: true,
                type: Object as () => Lecturer,
            },
        },
        setup(props: any) {
            const profilePicture = process.env.VUE_APP_API_BASE_URL + "/user-management/users/" + props.lecturer.username + "/image";
            function back() {
                Router.back();
            }
            return { back, profilePicture };
        },
    };
</script>
