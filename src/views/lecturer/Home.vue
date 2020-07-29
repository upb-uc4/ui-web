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
    import { store } from "../../store/store";
    import { Role } from "../../entities/Role";

    export default {
        name: "LecturerHome",
        components: {
            CourseList,
        },

        beforeRouteEnter(_to: any, _from: any, next: any) {
            const myRole = store.state.myRole;
            if (myRole != Role.LECTURER) {
                return next("/redirect");
            }
            return next();
        },
    };
</script>
