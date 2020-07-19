<template>
    <div class="w-full lg:mt-16 mt-8 bg-gray-300 mx-auto h-screen">
        <button class="flex items-center mb-4 navigation-link" @click="back">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>

        <div class="flex items-end justify-between">
            <h1 class="text-2xl font-medium text-gray-700 mb-8">
                {{ lecturer.firstName + " " + lecturer.lastName }} (@{{ lecturer.username }})
            </h1>
            <img
                class="w-32 h-32 mb-4 rounded-full object-cover"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRsZsJ3BZuN_DlUM3OBlxrb43heJhRAXhQ9_w&usqp=CAU"
            />
        </div>

        <div>
            <personal-section
                v-model:firstName="lecturer.firstName"
                v-model:lastName="lecturer.lastName"
                :birth-date="lecturer.birthDate"
                @save="save"
            />

            <contact-section v-model:email="lecturer.email" @save="save" />

            <address-section v-model:address="lecturer.address" @save="save" />

            <research-section v-model:description="lecturer.freeText" v-model:research-area="lecturer.researchArea" @save="save" />

            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Notifications</label>
                        <label class="block text-gray-600">
                            Control when and how to stay updated about recent activities.
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-6 flex items-start">
                            <input class="mt-2 w-6 h-6 form-checkbox text-blue-600" type="checkbox" checked />
                            <div class="ml-6 flex flex-col">
                                <label class="text-gray-700 text-lg font-medium">Course Activity</label>
                                <label class="text-gray-600">Get important notifications about the courses you are enrolled in</label>
                            </div>
                        </div>
                        <div class="mb-6 flex items-start">
                            <input class="mt-2 w-6 h-6 form-checkbox text-blue-600" type="checkbox" checked />
                            <div class="ml-6 flex flex-col">
                                <label class="text-gray-700 text-lg font-medium">Some Other Stuff</label>
                                <label class="text-gray-600">This was just an idea. Feel free to delete it.</label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
    import PersonalSection from "@/components/profile/PersonalSection.vue";
    import ContactSection from "@/components/profile/ContactSection.vue";
    import AddressSection from "@/components/profile/AddressSection.vue";
    import ResearchSection from "@/components/profile/lecturer/ResearchSection.vue";
    import { ref } from "vue";
    import Router from "@/router";
    import UserManagement from "@/api/UserManagement";
    import Lecturer from "../../api/api_models/user_management/Lecturer";

    export default {
        components: {
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
        setup(props: any) {
            const auth: UserManagement = new UserManagement();
            const lecturer = ref(props.user);

            async function save() {
                const response = await auth.updateUser(lecturer.value);
                //todo show toast
                //todo error handling
            }

            function back() {
                Router.back();
            }

            return { lecturer, save, back };
        },
    };
</script>
