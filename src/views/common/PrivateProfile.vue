<template>
    <base-view>
        <loading-spinner v-if="isLoading" />
        <div v-else>
            <private-student-profile v-if="user.role === Role.STUDENT" v-model:user="user" :error-bag="errorBag" />
            <private-lecturer-profile v-else-if="user.role === Role.LECTURER" v-model:user="user" :error-bag="errorBag" />
            <private-admin-profile v-else-if="user.role === Role.ADMIN" v-model:user="user" :error-bag="errorBag" />
            <button-section>
                <template #right>
                    <button id="updateProfile" class="sm:w-48 w-full btn-tmp" @click="updateProfile()">Update</button>
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
    import ProfileResponseHandler from "@/use/helpers/ProfileResponseHandler";
    import { Role } from "@/entities/Role";
    import { onBeforeMount, ref } from "vue";
    import Student from "@/api/api_models/user_management/Student";
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import Admin from "@/api/api_models/user_management/Admin";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";
    import BaseView from "@/views/common/BaseView.vue";
    import ValidationResponseHandler from "@/use/helpers/ValidationResponseHandler";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";

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
            const isLoading = ref(true);
            const errorBag = ref(new ErrorBag());

            onBeforeMount(() => {
                userManagement
                    .getOwnUser()
                    .then((userResponse) => new ProfileResponseHandler().handleResponse(userResponse))
                    .then((userResult) => (user.value = userResult))
                    .then(() => (isLoading.value = false));
            });

            function updateProfile() {
                console.log("update user");
                console.log(user);
                const handler = new ValidationResponseHandler("Profile");
                isLoading.value = true;
                userManagement
                    .updateUser(user.value)
                    .then((response) => handler.handleResponse(response))
                    .then((validationResult) => {
                        if (validationResult) {
                            //success
                            errorBag.value.clear();
                        } else {
                            errorBag.value = new ErrorBag(handler.errorList);
                        }
                    })
                    .then(() => (isLoading.value = false));
            }

            return { Role, user, isLoading, updateProfile, errorBag };
        },
    };
</script>
