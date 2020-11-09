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
                    <search-select v-model:selected="selectedOption" :options="optionsArray" input-id="lecturerId" />
                    <div :hidden="currentLecturer.username == ''" class="text-gray-700 text-md font-medium my-3">
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
    import SearchSelect from "@/components/common/SearchSelect.vue";

    export default {
        name: "LecturerSection",
        components: {
            SearchSelect,
        },
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
            const currentLecturer = ref({} as Lecturer);
            const lecturerFound = ref(false);
            const optionsShown = ref(false);
            const optionsArray = ref([] as String[]);
            const selectedOption = ref("");

            onBeforeMount(async () => {
                await getLecturers();
            });

            watch(selectedOption, () => {
                let lecId = selectedOption.value.substring(selectedOption.value.lastIndexOf("@") + 1, selectedOption.value.length - 1);
                let tmp = lecturers.value.find((l) => l.username == lecId) as Lecturer;
                if (tmp != undefined) {
                    currentLecturer.value = tmp;
                    emit("update:lecturerId", tmp.username);
                    lecturerFound.value = true;
                } else {
                    lecturerFound.value = false;
                    currentLecturer.value = {} as Lecturer;
                }
            });

            async function getLecturers() {
                const userManagement: UserManagement = new UserManagement();
                const handler = new GenericResponseHandler();
                const response = await userManagement.getAllUsersByRole(Role.LECTURER);
                const result = handler.handleResponse(response);
                if (result) {
                    lecturers.value = result as Lecturer[];
                    lecturers.value.forEach((l) => {
                        optionsArray.value.push(createOptionString(l));
                    });
                    if (props.lecturerId != "") {
                        currentLecturer.value = lecturers.value.filter((e) => e.username == props.lecturerId)[0];
                        selectedOption.value = createOptionString(currentLecturer.value);
                        lecturerFound.value = true;
                    }
                }
            }

            function createOptionString(l: Lecturer): string {
                return l.firstName + " " + l.lastName + " (@" + l.username + ")";
            }

            return {
                lecturers,
                currentLecturer,
                lecturerFound,
                optionsArray,
                selectedOption,
            };
        },
    };
</script>
