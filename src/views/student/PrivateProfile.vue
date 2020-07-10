<template>
    <div class="w-full lg:mt-16 mt-8 bg-gray-300 mx-auto h-screen">
        <button @click="back" class="flex items-center mb-4 navigation-link">
            <i class="fas text-xl fa-chevron-left"></i>
            <span class="font-bold text-sm ml-1">Back</span>
        </button>

        <div class="flex items-end justify-between">
            <h1 class="text-2xl font-medium text-gray-700 mb-8">{{ student.firstName + " " + student.lastName }} (@{{ student.username }})</h1>
            <img class="w-32 h-32 mb-4 rounded-full object-cover"
                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRsZsJ3BZuN_DlUM3OBlxrb43heJhRAXhQ9_w&usqp=CAU">
        </div>

        <div>
            <personal-section
                    v-model:firstName="student.firstName"
                    v-model:lastName="student.lastName"
                    v-on:save="save"
            />

            <contact-section
                    v-model:email="student.email"
                    v-on:save="save"
            />

            <address-section
                    v-model:address="student.address"
                    v-on:save="save"
            />

            <course-of-study-section
                    :fields-of-study="student.fieldsOfStudy"
                    :matriculation-id="student.matriculationId"
                    :semester-count="student.semesterCount"
            />

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
    import CourseOfStudySection from "@/components/profile/CourseOfStudySection.vue";
    import { ref } from "vue";
    import Router from "@/router"
    import StudentEntity from "@/entities/StudentEntity";
    import UserManagement from "@/api/UserManagement";

    export default {
        props: {
            user: {
                required: true,
                type: StudentEntity
            }
        },
        components: {
            PersonalSection,
            ContactSection,
            AddressSection,
            CourseOfStudySection
        },
        async setup(props: any) {
            const student = ref(props.user);
            const auth: UserManagement = new UserManagement();

            function back() {
                Router.back();
            }

            async function save() {
                const response = await auth.updateUser(student.value);
                //todo show toast
                //todo error handling
            }

            return {
                student,
                save,
                back,
            };
        },

        beforeRouteEnter(_from: any, _to: any, next: any) {
            //todo check if user is student
            next();
        },

        //todo add Leave Modal
    }
</script>