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
                    <div :hidden="newLecturerId == ''">
                        <label v-if="lecturerFound" class="text-gray-700 text-md font-medium mb-3">
                            <i class="text-green-400 fas fa-check mr-2"></i>
                            <router-link
                                class="navigation-link cursor-pointer hover:underline"
                                target="_blank"
                                :to="{ name: 'profile.public', params: { username: currentLecturer.username } }"
                            >
                                {{ currentLecturer.firstName }} {{ currentLecturer.lastName }}</router-link>
                        </label>
                        <label v-else class="text-gray-700 text-md font-medium mb-3">
                            <i class="text-red-400 fas fa-times mr-2"></i>
                            Lecturer-ID not found!
                        </label>
                    </div>
                    <p v-if="errorBag.has('lecturerId')" class="error-message">
                        {{ errorBag.get("lecturerId") }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { computed, onBeforeMount, ref, watch } from "vue";
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import UserManagement from "@/api/UserManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { Role } from "@/entities/Role";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import Router from "@/use/router";

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
        emits: ["update:lecturerId"],
        setup(props: any, { emit }: any) {
            const lecturers = ref([] as Lecturer[]);
            const newLecturerId = ref(props.lecturerId);
            const currentLecturer = ref({} as Lecturer);
            const lecturerFound = ref(true);

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

            watch(newLecturerId, () => {
                emit("update:lecturerId", newLecturerId.value);
                let lecturer = lecturers.value.filter((e) => e.username == newLecturerId.value)[0];
                if (lecturer) {
                    lecturerFound.value = true;
                    currentLecturer.value = lecturer;
                } else {
                    lecturerFound.value = false;
                    currentLecturer.value = {} as Lecturer;
                }
            });

            return {
                lecturers,
                newLecturerId,
                currentLecturer,
                lecturerFound,
            };
        },
    };
</script>
