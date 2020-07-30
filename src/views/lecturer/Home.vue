<template>
    <div>
        <div class="mt-32 text-4xl text-center font-semibold text-gray-900">My Courses</div>
        <div class="mt-8 flex justify-center">
            <course-list />
        </div>
    </div>
</template>

<script lang="ts">
    import CourseList from "../../components/LecturerCourseList.vue";
    import { checkPrivilege } from "../../use/PermissionHelper";
    import { Role } from "../../entities/Role";

    export default {
        name: "LecturerHome",
        components: {
            CourseList,
        },

        async beforeRouteEnter(_to: any, _from: any, next: any) {
            const response = await checkPrivilege(Role.LECTURER);

            if (response.allowed) {
                return next();
            }
            if (!response.authenticated) {
                return next("/login");
            }

            return next("/redirect");
        },
    };
</script>
