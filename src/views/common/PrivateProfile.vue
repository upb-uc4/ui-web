<template>
    <base-view>
        <loading-spinner v-if="isLoading" />
        <div v-else>
            <private-student-profile v-if="user.role === Role.STUDENT" v-model:user="user" />
            <private-lecturer-profile v-else-if="user.role === Role.LECTURER" v-model:user="user" />
            <private-admin-profile v-else-if="user.role === Role.ADMIN" v-model:user="user" :error-bag="errorBag" @save="onSave()" />
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
    import { cloneDeep } from "lodash";

    export default {
        components: {
            BaseView,
            PrivateStudentProfile,
            PrivateLecturerProfile,
            PrivateAdminProfile,
            LoadingSpinner,
        },
        setup() {
            const userManagement = new UserManagement();
            const user = ref({} as Student | Lecturer | Admin);
            const userCopy = ref({} as Student | Lecturer | Admin);
            const isLoading = ref(true);
            const errorBag = ref(new ErrorBag());

            onBeforeMount(() => {
                userManagement
                    .getOwnUser()
                    .then((userResponse) => new ProfileResponseHandler().handleResponse(userResponse))
                    .then((userResult) => {
                        user.value = cloneDeep(userResult);
                        userCopy.value = cloneDeep(userResult);
                    })
                    .then((isLoading.value = false));
            });

            function onSave() {
                const handler = new ValidationResponseHandler("Profile");
                userManagement
                    .updateUser(user.value)
                    .then((response) => handler.handleResponse(response))
                    .then((validationResult) => {
                        if (validationResult) {
                            //success
                            errorBag.value.clear();
                        } else {
                            user.value = userCopy.value;
                            errorBag.value = new ErrorBag(handler.errorList);
                        }
                    });
            }

            return { Role, user, isLoading, onSave, errorBag, userCopy };
        },
    };
</script>
