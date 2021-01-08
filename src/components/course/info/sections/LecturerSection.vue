<template>
    <section class="border-t-2 py-8 border-gray-400">
        <div class="lg:flex">
            <div class="w-full lg:w-1/3 lg:block mr-12 flex flex-col mb-4">
                <label class="block text-gray-700 text-md font-medium mb-2">Lecturer</label>
                <label class="block text-gray-600"> The lecturer that will hold the course</label>
            </div>
            <div class="w-full lg:w-2/3">
                <div class="mb-4 w-full">
                    <label class="text-gray-700 text-md font-medium block mb-4">Lecturer</label>
                    <input id="lecturerName" type="text" class="w-full form-input input-text" disabled :value="lecturer" />
                    <div class="text-gray-700 text-md font-medium my-3">
                        <label>
                            <i class="text-green-400 fas fa-check mr-2"></i>
                            {{ lecturer }} (
                            <router-link
                                class="navigation-link cursor-pointer hover:underline"
                                target="_blank"
                                :to="{ name: 'profile.public', params: { username: lecturerId } }"
                            >
                                @{{ lecturerId }}
                            </router-link>
                            )
                        </label>
                    </div>
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
    import SearchSelectOption from "@/use/helpers/SearchSelectOption";

    export default {
        name: "LecturerSection",
        props: {
            lecturer: {
                type: String,
                required: true,
            },
            lecturerId: {
                type: String,
                required: true,
            },
        },
    };
</script>
