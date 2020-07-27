<template>
    <div>
        <dev-nav-bar />
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
    import DevNavBar from "../../components/dev_components/DevNavBar.vue";

    export default {
        name: "LecturerHome",
        components: {
            CourseList,
            DevNavBar,
        },

        async beforeRouteEnter(_to: any, _from: any, next: any) {
            const allowed = await checkPrivilege(Role.LECTURER);

            if (allowed) {
                return next();
            }
            return next("/redirect");
        },
    };
</script>
