<template>
    <div v-if="busy" class="mx-auto">
        <loading-spinner />
    </div>
    <div v-else>
        <private-student-profile v-if="user.role === Role.STUDENT" v-model:user="user" />
        <private-lecturer-profile v-else-if="user.role === Role.LECTURER" v-model:user="user" />
        <private-admin-profile v-else-if="user.role === Role.ADMIN" v-model:user="user" />
    </div>
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

    export default {
        components: {
            PrivateStudentProfile,
            PrivateLecturerProfile,
            PrivateAdminProfile,
            LoadingSpinner,
        },
        setup() {
            const user = ref({} as Student | Lecturer | Admin);
            const busy = ref(false);

            onBeforeMount(async () => {
                await getUser();
            });

            async function getUser() {
                busy.value = true;
                const auth: UserManagement = new UserManagement();
                const responseHandler = new ProfileResponseHandler();
                const response = await auth.getOwnUser();
                const result = responseHandler.handleResponse(response);
                if (result) {
                    user.value = result;
                }
                busy.value = false;
            }
            return { Role, user, busy };
        },
    };
</script>
