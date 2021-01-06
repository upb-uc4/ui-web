<template>
    <div class="w-full lg:mt-16 mt-8 bg-gray-300 mx-auto h-screen">
        <button id="navigateBack" class="flex items-center mb-4 navigation-link" @click="back">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>

        <div class="flex items-end justify-between">
            <h1 class="text-2xl font-medium text-gray-700 mb-8">
                {{ lecturer.firstName + " " + lecturer.lastName }} (@{{ lecturer.username }})
            </h1>
        </div>

        <div>
            <profile-picture-section :username="lecturer.username" />
            <personal-section :first-name="lecturer.firstName" :last-name="lecturer.lastName" :birth-date="lecturer.birthDate" />

            <contact-section v-model:user="lecturer" />

            <address-section v-model:user="lecturer" />

            <research-section v-model:user="lecturer" />
        </div>
    </div>
</template>

<script lang="ts">
    import PersonalSection from "@/components/profile/PersonalSection.vue";
    import ContactSection from "@/components/profile/ContactSection.vue";
    import AddressSection from "@/components/profile/AddressSection.vue";
    import ResearchSection from "@/components/profile/lecturer/ResearchSection.vue";
    import { ref } from "vue";
    import Router from "@/use/router";
    import UserManagement from "@/api/UserManagement";
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ProfilePictureSection from "@/components/profile/ProfilePictureSection.vue";

    export default {
        components: {
            ProfilePictureSection,
            PersonalSection,
            ContactSection,
            AddressSection,
            ResearchSection,
        },
        props: {
            user: {
                required: true,
                type: Object as () => Lecturer,
            },
        },
        emits: ["update:user"],
        setup(props: any, { emit }: any) {
            const lecturer = ref(props.user);

            function back() {
                Router.back();
            }

            return { lecturer: useModelWrapper(props, emit, "user"), back };
        },
    };
</script>
