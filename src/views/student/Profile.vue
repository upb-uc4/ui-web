<template>
    <div v-show="!loading" class="w-full lg:mt-16 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="back" class="flex items-center mb-4 navigation-link">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>

        <div class="flex items-end justify-between">
            <h1 class="text-2xl font-medium text-gray-700 mb-8">{{ studentMock.firstName + " " + studentMock.lastName }} (@{{ studentMock.username }})</h1>
            <img class="w-32 h-32 mb-4 rounded-full object-cover"
                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRsZsJ3BZuN_DlUM3OBlxrb43heJhRAXhQ9_w&usqp=CAU">
        </div>

        <div>
            <personal-section
                v-model:firstName="studentMock.firstName"
                v-model:lastName="studentMock.lastName"
                v-on:save="save"
            />

            <contact-section
                v-model:email="studentMock.email"
                v-on:save="save"
            />

            <address-section
                v-model:address="studentMock.address"
                v-on:save="save"
            />

            <section class="border-t-2 py-8 border-gray-400">
                <div class="lg:flex">
                    <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                        <label class="block text-gray-700 text-lg font-medium mb-2">Course of Study</label>
                        <label class="block text-gray-600">
                            Information related to your individual academic career.
                        </label>
                    </div>
                    <div class="w-full lg:w-2/3">
                        <div class="mb-6 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Field of Study</label>
                            <input placeholder="Computer Science" type="number" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                        <div class="mb-6 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Degree Sought</label>
                            <input placeholder="Master's Degree" type="number" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                        <div class="mb-6 flex flex-col">
                            <label class="text-gray-700 text-md font-medium mb-3">Semester Count</label>
                            <input placeholder="4" type="number" class="w-full border-2 border-gray-400 rounded-lg py-3 text-gray-600 form-input">
                        </div>
                    </div>
                </div>
            </section>

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
                            <input class="mt-2 w-6 h-6 form-checkbox text-blue-600" type="checkbox" checked>
                            <div class="ml-6 flex flex-col">
                                <label class="text-gray-700 text-lg font-medium">Course Activity</label>
                                <label class="text-gray-600">Get important notifications about the courses you are enrolled in</label>
                            </div>
                        </div>
                        <div class="mb-6 flex items-start">
                            <input class="mt-2 w-6 h-6 form-checkbox text-blue-600" type="checkbox" checked>
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
    import StudentEntity from "@/entities/StudentEntity";
    import { onMounted, ref } from "vue";
    import {store} from "@/store/store";
    import UserManagement from "@/api/UserManagement";
    import Student from "@/api/api_models/user_management/Student";

    export default {
        components: {
            PersonalSection,
            ContactSection,
            AddressSection
        },
        setup() {
            const loading = ref(true);
            const auth: UserManagement = new UserManagement();
            const studentMock = ref (new StudentEntity(true));

            onMounted( () => {
                loadStudent();
            });

            async function loadStudent() {
                //todo remove after tinkering
                await auth.login({username: "student", password: "student"})
                    .then((success : boolean)=> {
                        if (success) {
                            store.state.myId = "student";
                        }
                    })
                await auth.getOwnUser().then( (value) => {
                    studentMock.value = value as Student;
                });
                loading.value = false;
            }

            function save() {
                auth.updateUser(studentMock.value).then( (success) => {
                    if (success) {
                        console.log("user updated successful.");
                    } else {
                        console.error("user profile update failed.")
                    }
                })
            }

            return {studentMock, save, loading};
        },

        beforeRouteEnter(_from: any, _to: any, next: any) {
            //todo check if user is student
            next();
        },
    }
</script>