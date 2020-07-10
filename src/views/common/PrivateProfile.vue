<template>
<!--    todo: Change between student/lecturer-->
    <private-student-profile v-if="user.role === Role.STUDENT" :user="user"/>
</template>

<script lang="ts">
    import PrivateStudentProfile from "@/views/student/PrivateProfile.vue";
    import UserManagement from "@/api/UserManagement";
    import ProfileResponseHandler from "@/use/ProfileResponseHandler";
    import {Role} from "@/entities/Role";

    export default {
        components: {
            PrivateStudentProfile
        },
        async setup() {
            const auth: UserManagement = new UserManagement();
            const responseHandler = new ProfileResponseHandler();
            const response = await auth.getOwnUser();
            const user = responseHandler.handleReponse(response);
            return {Role, user}
        }
    }
</script>