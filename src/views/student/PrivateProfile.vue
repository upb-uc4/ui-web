<template>
    <div class="w-full lg:mt-16 mt-8 bg-gray-300 mx-auto h-screen">
        <button id="navigateBack" class="flex items-center mb-4 navigation-link" @click="back">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>

        <div class="flex items-end justify-between">
            <h1 class="text-2xl font-medium text-gray-700 mb-8">
                {{ student.firstName + " " + student.lastName }} (@{{ student.username }})
            </h1>
        </div>

        <div>
            <profile-picture-section :username="student.username" />
            <personal-section :first-name="student.firstName" :last-name="student.lastName" :birth-date="student.birthDate" />

            <contact-section v-model:user="student" />

            <address-section v-model:user="student" />

            <course-of-study-section :matriculation-id="student.matriculationId" :latest="student.latestImmatriculation" />
        </div>
    </div>
</template>

<script lang="ts">
    import ProfilePictureSection from "@/components/profile/ProfilePictureSection.vue";
    import PersonalSection from "@/components/profile/PersonalSection.vue";
    import ContactSection from "@/components/profile/ContactSection.vue";
    import AddressSection from "@/components/profile/AddressSection.vue";
    import CourseOfStudySection from "@/components/profile/student/CourseOfStudySection.vue";
    import { ref } from "vue";
    import Router from "@/use/router";
    import UserManagement from "@/api/UserManagement";
    import Student from "@/api/api_models/user_management/Student";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";

    export default {
        components: {
            ProfilePictureSection,
            PersonalSection,
            ContactSection,
            AddressSection,
            CourseOfStudySection,
        },
        props: {
            user: {
                required: true,
                type: Object as () => Student,
            },
        },
        emits: ["update:user"],
        setup(props: any, { emit }: any) {
            const student = ref(props.user as Student);

            function back() {
                Router.back();
            }

            return {
                student: useModelWrapper(props, emit, "user"),
                back,
            };
        },
        //todo add Leave Modal
    };
</script>
