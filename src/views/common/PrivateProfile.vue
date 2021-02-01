<template>
    <base-view>
        <loading-spinner v-if="isLoading" />
        <div v-else>
            <private-student-profile v-if="user.role === Role.STUDENT" v-model:user="user" :error-bag="errorBag" />
            <private-lecturer-profile v-else-if="user.role === Role.LECTURER" v-model:user="user" :error-bag="errorBag" />
            <private-admin-profile v-else-if="user.role === Role.ADMIN" v-model:user="user" :error-bag="errorBag" />
            <button-section>
                <template #right>
                    <button id="updateProfile" :disabled="!isChanged" class="sm:w-48 w-full btn" @click="updateProfile()">Update</button>
                </template>
            </button-section>
        </div>
    </base-view>
</template>

<script lang="ts">
    import PrivateStudentProfile from "@/views/student/PrivateProfile.vue";
    import PrivateLecturerProfile from "@/views/lecturer/PrivateProfile.vue";
    import PrivateAdminProfile from "@/views/admin/PrivateProfile.vue";
    import UserManagement from "@/api/UserManagement";
    import { Role } from "@/entities/Role";
    import { computed, onBeforeMount, ref } from "vue";
    import Student from "@/api/api_models/user_management/Student";
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import Admin from "@/api/api_models/user_management/Admin";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import BaseView from "@/views/common/BaseView.vue";
    import ValidationResponseHandler from "@/use/helpers/ValidationResponseHandler";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import __ from "lodash";
    import { useStore } from "@/use/store/store";
    import { MutationTypes } from "@/use/store/mutation-types";

    export default {
        components: {
            BaseView,
            PrivateStudentProfile,
            PrivateLecturerProfile,
            PrivateAdminProfile,
            LoadingSpinner,
            ButtonSection,
        },
        setup() {
            const userManagement = new UserManagement();
            const user = ref({} as Student | Lecturer | Admin);
            const oldUser = ref({} as Student | Lecturer | Admin); // Used to see if changes present
            const isLoading = ref(true);
            const errorBag = ref(new ErrorBag());
            const store = useStore();

            const isChanged = computed(() => !__.isEqual(user.value, oldUser.value));

            onBeforeMount(() => {
                store.getters.user
                    .then((userResult) => {
                        user.value = userResult;
                        oldUser.value = userResult;
                    })
                    .then(() => (isLoading.value = false));
            });

            function updateProfile() {
                const handler = new ValidationResponseHandler("Profile");
                isLoading.value = true;
                userManagement
                    .updateUser(user.value)
                    .then((response) => handler.handleResponse(response))
                    .then((validationResult) => {
                        if (validationResult) {
                            //success
                            errorBag.value.clear();
                            store.commit(MutationTypes.SET_USER, user.value);
                            oldUser.value = user.value;
                        } else {
                            errorBag.value = new ErrorBag(handler.errorList);
                        }
                    })
                    .then(() => (isLoading.value = false));
            }

            return { Role, user, isLoading, updateProfile, errorBag, isChanged };
        },
    };
</script>
