<template>
    <private-student-profile v-if="user.role === Role.STUDENT" v-model:user="user" />
    <private-lecturer-profile v-else-if="user.role === Role.LECTURER" v-model:user="user" />
    <private-admin-profile v-else-if="user.role === Role.ADMIN" v-model:user="user" />
</template>

<script lang="ts">
    import PrivateStudentProfile from "@/views/student/PrivateProfile.vue";
    import PrivateLecturerProfile from "@/views/lecturer/PrivateProfile.vue";
    import PrivateAdminProfile from "@/views/admin/PrivateProfile.vue";
    import UserManagement from "@/api/UserManagement";
    import ProfileResponseHandler from "@/use/ProfileResponseHandler";
    import { Role } from "@/entities/Role";
    import { ref } from "vue";

    export default {
        components: {
            PrivateStudentProfile,
            PrivateLecturerProfile,
            PrivateAdminProfile,
        },
        async setup() {
            const auth: UserManagement = new UserManagement();
            const responseHandler = new ProfileResponseHandler();
            const response = await auth.getOwnUser();
            const user = ref(responseHandler.handleReponse(response));
            return { Role, user };
        },
    };
</script>
