<template>
    <base-view>
        <loading-spinner v-if="isLoading" />
        <div v-else>
            <public-student-profile v-if="user.role === Role.STUDENT" :student="user" />
            <public-lecturer-profile v-else-if="user.role === Role.LECTURER" :lecturer="user" />
        </div>
    </base-view>
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
    import BaseView from "@/views/common/BaseView.vue";

    export default {
        components: {
            BaseView,
            PublicStudentProfile,
            PublicLecturerProfile,
            LoadingSpinner,
        },
        setup() {
            const username: string = Router.currentRoute.value.params.username as string;
            const user = ref({} as Student | Lecturer | Admin);
            const isLoading = ref(true);

            onBeforeMount(() => {
                const userManagement = new UserManagement();
                userManagement
                    .getSpecificUser(username)
                    .then((response) => new ProfileResponseHandler().handleResponse(response))
                    .then((result) => {
                        user.value = result;
                        window.document.title = user.value.firstName + " " + user.value.lastName + " (@" + username + ") | UC4";
                    })
                    .then(() => (isLoading.value = false));
            });

            return { Role, user, isLoading };
        },
    };
</script>
