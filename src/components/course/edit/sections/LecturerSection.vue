<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-md font-medium mb-2">Lecturer</label>
                <label class="block text-gray-600"> Select a lecturer that will hold the course</label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Lecturer-ID</label>
                    <input
                        v-model="newLecturerId"
                        list="lecturerList"
                        class="form-input input-select mb-3"
                        placeholder="Select a Lecturer"
                    />
                    <datalist id="lecturerList">
                        <option v-for="lecturer in lecturers" :key="lecturer.username" :value="lecturer.username">
                            {{ lecturer.firstName }} {{ lecturer.lastName }} (@{{ lecturer.username }})
                        </option>
                    </datalist>
                    <label
                        :hidden="newLecturerId == ''"
                        class="text-md font-medium mb-3"
                        :class="{ 'text-green-600': lecturerFound, 'text-red-600': !lecturerFound }"
                    >{{ lecturerDisplay }}</label>
                    <p v-if="errorBag.has('lecturerId')" class="error-message">
                        {{ errorBag.get("lecturerId") }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { computed, onBeforeMount, ref } from "vue";
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import UserManagement from "@/api/UserManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { Role } from "@/entities/Role";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";

    export default {
        name: "LecturerSection",
        props: {
            errorBag: {
                required: true,
                type: ErrorBag,
            },
            lecturerId: {
                type: String,
                required: true,
            },
        },
        emits: ["update:lecturerid"],
        setup(props: any, { emit }: any) {
            const lecturers = ref([] as Lecturer[]);
            const newLecturerId = ref(props.lecturerId);
            const lecturerFound = ref(false);

            onBeforeMount(() => {
                getLecturers();
            });

            async function getLecturers() {
                const userManagement: UserManagement = new UserManagement();
                const handler = new GenericResponseHandler();
                const response = await userManagement.getAllUsersByRole(Role.LECTURER);
                const result = handler.handleReponse(response);
                if (result) {
                    lecturers.value = result as Lecturer[];
                }
            }

            const lecturerDisplay = computed(() => {
                let lecturer = lecturers.value.filter((e) => e.username == newLecturerId.value)[0];
                if (lecturer) {
                    lecturerFound.value = true;
                    return "Lecturer found: " + lecturer.firstName + " " + lecturer.lastName;
                } else {
                    lecturerFound.value = false;
                    return "Lecturer not found!";
                }
            });

            return {
                lecturers,
                newLecturerId,
                lecturerDisplay,
                lecturerFound,
            };
        },
    };
</script>
