<template>
    <div>
        <suspense>
            <template #default>
                <div v-for="course in shownCourses" :key="course.courseId">
                    <lecturer-course v-if="isLecturer" :course="course" class="mb-8" />
                    <student-course v-if="isStudent" :course="course" class="mb-8" />
                </div>
            </template>
            <template #fallback/>
        </suspense>
    </div>
</template>

<script lang="ts">
    import { useStore } from "@/store/store";
    import { Role } from "@/entities/Role";
    import LecturerCourse from "./LecturerCourse.vue";
    import StudentCourse from "./StudentCourse.vue";
    import CourseManagement from "@/api/CourseManagement";
    import GenericResponseHandler from "@/use/GenericResponseHandler";
    import { computed } from 'vue';
    import { CourseType } from '@/entities/CourseType';

    export default {
        name: "CourseList",
        components: {
            LecturerCourse,
            StudentCourse,
        },
        props: {
            selectedType: {
                type: String,
                required: true,
            }
        },

        async setup(props:any) {
            const store = useStore();
            let role = await store.getters.role;
            let isLecturer: boolean = role == Role.LECTURER;
            let isStudent: boolean = role == Role.STUDENT;
            let courseManagement: CourseManagement = new CourseManagement();
            let myId = (await store.getters.loginData).username;

            const genericResponseHandler = new GenericResponseHandler();
            const response = await courseManagement.getCourses();
            let courses = genericResponseHandler.handleReponse(response);

            if (isLecturer) {
                courses = courses.filter((course) => course.lecturerId == myId);
            }

            let shownCourses = computed(() => {
                return props.selectedType == "All" as CourseType ? courses : courses.filter(e => e.courseType == props.selectedType)
            })

            return {
                role,
                myId,
                shownCourses,
                isLecturer,
                isStudent,
            };
        },
    };
</script>
