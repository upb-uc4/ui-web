<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-md font-medium mb-2">Lecturer</label>
                <label class="block text-gray-600"> Select a lecturer that will hold the course</label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-4 flex flex-col">
                    <label class="text-gray-700 text-md font-medium mb-3">Lecturer</label>
                    <input v-model="lecturer" list="lecturerList" class="form-input input-select" placeholder="Select a Lecturer" />
                    <datalist id="lecturerList">
                        <option v-for="lecturer in lecturers" :key="lecturer.username" :value="lecturer">
                            {{ lecturer.firstName }} {{ lecturer.lastName }} (@{{ lecturer.username }})
                        </option>
                    </datalist>
                    <p v-if="errorBag.has('lecturerId')" class="error-message">
                        {{ errorBag.get("lecturerId") }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import { onBeforeMount, ref } from "vue";
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
            const lecturer = ref(props.lecturerId);
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

            return {
                lecturers,
                lecturer,
            };
        },
    };
</script>
