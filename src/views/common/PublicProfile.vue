<template>
    <public-student-profile v-if="user.role === Role.STUDENT" :student="user"/>
    <public-lecturer-profile v-else-if="user.role === Role.LECTURER" :lecturer="user"/>
</template>

<script lang="ts">
    import PublicStudentProfile from "@/views/student/PublicProfile.vue";
    import PublicLecturerProfile from "@/views/lecturer/PublicProfile.vue";
    import Router from "@/router";
    import UserManagement from "@/api/UserManagement";
    import ProfileResponseHandler from "@/use/ProfileResponseHandler";
    import {Role} from "@/entities/Role";

    export default {
        components: {
            PublicStudentProfile,
            PublicLecturerProfile
        },
        async setup() {
            const username: string = Router.currentRoute.value.params.username as string;
            const auth: UserManagement = new UserManagement();

            const responseHandler = new ProfileResponseHandler();
            const response = await auth.getSpecificUser(username);
            const user = responseHandler.handleReponse(response);
            return {Role, user}
        }
    }
</script>