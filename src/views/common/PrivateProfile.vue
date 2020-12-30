<template>
    <base-view>
        <loading-spinner v-if="isLoading" />
        <div v-else>
            <private-student-profile v-if="user.role === Role.STUDENT" v-model:user="user" />
            <private-lecturer-profile v-else-if="user.role === Role.LECTURER" v-model:user="user" />
            <private-admin-profile v-else-if="user.role === Role.ADMIN" v-model:user="user" />
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

    export default {
        components: {
            BaseView,
            PrivateStudentProfile,
            PrivateLecturerProfile,
            PrivateAdminProfile,
            LoadingSpinner,
        },
        setup() {
            const user = ref({} as Student | Lecturer | Admin);
            const isLoading = ref(true);

            onBeforeMount(() => {
                const auth: UserManagement = new UserManagement();
                auth.getOwnUser()
                    .then((userResponse) => new ProfileResponseHandler().handleResponse(userResponse))
                    .then((userResult) => (user.value = userResult))
                    .then((isLoading.value = false));
            });

            return { Role, user, isLoading };
        },
    };
</script>
