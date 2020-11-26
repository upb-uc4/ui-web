<template>
    <div class="w-full h-screen mx-auto mt-8 bg-gray-300 lg:mt-16">
        <button id="navigateBack" class="flex items-center mb-4 navigation-link" @click="back">
            <i class="text-xl fas fa-chevron-left"></i>
            <span class="ml-1 text-sm font-bold">Back</span>
        </button>

        <div class="flex items-end justify-between">
            <h1 class="mb-8 text-2xl font-medium text-gray-700">{{ admin.firstName + " " + admin.lastName }} (@{{ admin.username }})</h1>
        </div>

        <div>
            <profile-picture-section :username="admin.username" />
            <personal-section :first-name="admin.firstName" :last-name="admin.lastName" :birth-date="admin.birthDate" />

            <contact-section v-model:user="admin" />

            <address-section v-model:user="admin" />
        </div>
    </div>
</template>

<script lang="ts">
    import ProfilePictureSection from "@/components/profile/ProfilePictureSection.vue";
    import PersonalSection from "@/components/profile/PersonalSection.vue";
    import ContactSection from "@/components/profile/ContactSection.vue";
    import AddressSection from "@/components/profile/AddressSection.vue";
    import { ref } from "vue";
    import Router from "@/use/router";
    import UserManagement from "@/api/UserManagement";
    import Admin from "../../api/api_models/user_management/Admin";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";

    export default {
        components: {
            PersonalSection,
            ContactSection,
            AddressSection,
            ProfilePictureSection,
        },
        props: {
            user: {
                required: true,
                type: Object as () => Admin,
            },
        },
        emits: ["update:user"],
        setup(props: any, { emit }: any) {
            const admin = ref(props.user);

            function back() {
                Router.back();
            }

            return { admin: useModelWrapper(props, emit, "user"), back };
        },
    };
</script>
