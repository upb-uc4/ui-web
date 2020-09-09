<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-md font-medium mb-2">Lecturer</label>
                <label class="block text-gray-600"> Select a lecturer that will hold the course</label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-4 w-full relative">
                    <label class="text-gray-700 text-md font-medium block mb-4">Lecturer-ID</label>
                    <input
                        id="lecturerId"
                        v-model="input"
                        class="form-select input-select block w-full"
                        placeholder="Select a Lecturer"
                        @focus="showOptions()"
                        @blur="hideOptions()"
                        @keyup="keyMonitor"
                    />
                    <div v-show="optionsShown" class="bg-white overflow-auto border absolute border-gray-500 w-full">
                        <div
                            v-for="lecturer in filteredLecturers"
                            :key="lecturer.username"
                            class="text-gray-600 p-2 text-md cursor-pointer hover:bg-blue-500 hover:text-gray-100 block"
                            @mousedown="selectOption(lecturer)"
                        >
                            {{ lecturer.firstName }} {{ lecturer.lastName }} (@{{ lecturer.username }})
                        </div>
                    </div>
                    <div :hidden="newLecturerId == ''" class="text-gray-700 text-md font-medium my-3">
                        <label v-if="lecturerFound">
                            <i class="text-green-400 fas fa-check mr-2"></i>
                            {{ currentLecturer.firstName }} {{ currentLecturer.lastName }} (
                            <router-link
                                class="navigation-link cursor-pointer hover:underline"
                                target="_blank"
                                :to="{ name: 'profile.public', params: { username: currentLecturer.username } }"
                            >
                                @{{ currentLecturer.username }}
                            </router-link>
                            )
                        </label>
                        <label v-else>
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
            const lecturerFound = ref(false);
            const input = ref(props.lecturerId);
            const optionsShown = ref(false);

            onBeforeMount(() => {
                getLecturers();
            });

            const filteredLecturers = computed(() => {
                return lecturers.value.filter(
                    (e) =>
                        e.username.toLowerCase().includes(input.value.toLowerCase()) ||
                        (e.firstName + " " + e.lastName).toLowerCase().includes(input.value.toLowerCase())
                );
            });

            function selectOption(lecturer: Lecturer) {
                currentLecturer.value = lecturer;
                optionsShown.value = false;
                input.value = currentLecturer.value.username;
            }

            function showOptions() {
                input.value = "";
                optionsShown.value = true;
            }

            function keyMonitor(event: KeyboardEvent) {
                if (event.key === "Enter" && filteredLecturers.value[0]) {
                    selectOption(filteredLecturers.value[0]);
                }
            }

            function hideOptions() {
                optionsShown.value = false;
            }

            async function getLecturers() {
                const userManagement: UserManagement = new UserManagement();
                const handler = new GenericResponseHandler();
                const response = await userManagement.getAllUsersByRole(Role.LECTURER);
                const result = handler.handleReponse(response);
                if (result) {
                    lecturers.value = result as Lecturer[];
                    if (props.lecturerId != "") {
                        currentLecturer.value = lecturers.value.filter((e) => e.username == props.lecturerId)[0];
                    }
                }
            }

            watch(input, () => {
                newLecturerId.value = input.value;
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
                filteredLecturers,
                input,
                selectOption,
                showOptions,
                keyMonitor,
                optionsShown,
                hideOptions,
            };
        },
    };
</script>
