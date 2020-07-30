<template>
    <div>
        <dev-nav-bar />
        <div class="mt-32 text-4xl text-center font-semibold text-gray-900">Available Courses</div>
        <div class="mt-8 flex justify-center">
            <course-list />
        </div>
    </div>
</template>

<script lang="ts">
    import CourseList from "../../components/StudentCourseList.vue";
    import DevNavBar from "../../components/dev_components/DevNavBar.vue";
    import { checkPrivilege } from "../../use/PermissionHelper";
    import { Role } from "../../entities/Role";

    export default {
        name: "StudentHome",
        components: {
            CourseList,
            DevNavBar,
        },
        async beforeRouteEnter(_to: any, _from: any, next: any) {
            const response = await checkPrivilege(Role.STUDENT);

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
