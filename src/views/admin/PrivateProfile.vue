<template>
    <div class="w-full h-screen mx-auto mt-8 bg-gray-300 lg:mt-16">
        <button id="navigateBack" class="flex items-center mb-4 navigation-link" @click="back">
            <i class="text-xl fas fa-chevron-left"></i>
            <span class="ml-1 text-sm font-bold">Back</span>
        </button>

        <div class="flex items-end justify-between">
            <h1 class="mb-8 text-2xl font-medium text-gray-700">{{ admin.firstName + " " + admin.lastName }} (@{{ admin.username }})</h1>
            <img
                class="object-cover w-32 h-32 mb-4 rounded-full"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRsZsJ3BZuN_DlUM3OBlxrb43heJhRAXhQ9_w&usqp=CAU"
            />
        </div>

        <div>
            <personal-section :first-name="admin.firstName" :last-name="admin.lastName" :birth-date="admin.birthDate" />

            <contact-section v-model:user="admin" />

            <address-section v-model:user="admin" />

            <section class="py-8 border-t-2 border-gray-400">
                <div class="lg:flex">
                    <div class="flex flex-col w-full mb-4 mr-12 lg:w-1/3 lg:block">
                        <label class="block mb-2 text-lg font-medium text-gray-700">Notifications</label>
                        <label class="block text-gray-600">
                            Control when and how to stay updated about recent activities.
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="flex items-start mb-6">
                            <input id="otherCheckbox" class="w-6 h-6 mt-2 text-blue-600 form-checkbox" type="checkbox" checked />
                            <div class="flex flex-col ml-6">
                                <label class="text-lg font-medium text-gray-700">Some Other Stuff</label>
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
    import { ref } from "vue";
    import Router from "@/router";
    import UserManagement from "@/api/UserManagement";
    import Admin from "../../api/api_models/user_management/Admin";
    import { useModelWrapper } from "@/use/ModelWrapper";

    export default {
        components: {
            PersonalSection,
            ContactSection,
            AddressSection,
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
