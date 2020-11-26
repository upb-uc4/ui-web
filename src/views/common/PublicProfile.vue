<template>
    <div v-if="busy" class="mx-auto">
        <loading-spinner />
    </div>
    <div v-else>
        <public-student-profile v-if="user.role === Role.STUDENT" :student="user" />
        <public-lecturer-profile v-else-if="user.role === Role.LECTURER" :lecturer="user" />
    </div>
</template>

<script lang="ts">
    import PublicStudentProfile from "@/views/student/PublicProfile.vue";
    import PublicLecturerProfile from "@/views/lecturer/PublicProfile.vue";
    import Router from "@/use/router";
    import UserManagement from "@/api/UserManagement";
    import ProfileResponseHandler from "@/use/helpers/ProfileResponseHandler";
    import { Role } from "@/entities/Role";
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import Admin from "@/api/api_models/user_management/Admin";
    import Student from "@/api/api_models/user_management/Student";
    import { onBeforeMount, ref } from "vue";
    import LoadingSpinner from "@/components/common/loading/Spinner.vue";

    export default {
        components: {
            PublicStudentProfile,
            PublicLecturerProfile,
            LoadingSpinner,
        },
        setup() {
            const username: string = Router.currentRoute.value.params.username as string;
            const user = ref({} as Lecturer | Admin | Student);
            const busy = ref(false);

            onBeforeMount(async () => {
                await getUser();
            });

            async function getUser() {
                busy.value = true;
                const auth: UserManagement = new UserManagement();
                const responseHandler = new ProfileResponseHandler();
                const response = await auth.getSpecificUser(username);
                user.value = responseHandler.handleResponse(response);
                window.document.title = user.value.firstName + " " + user.value.lastName + " (@" + username + ") | UC4";
                busy.value = true;
            }
            return { Role, user };
        },
    };
</script>
