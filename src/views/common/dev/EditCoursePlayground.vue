<template>
    <base-view>
        <section-header title="Edit Course" />
        <lecturer-section v-model:lecturerId="course.lecturerId" />
        <info-section
            v-model:name="course.courseName"
            v-model:type="course.courseType"
            v-model:language="course.courseLanguage"
            v-model:ects="course.ects"
            v-model:description="course.courseDescription"
        />
        <restrictions-section v-model:max-participants="course.maxParticipants" />
        <button-section>
            <template #left>
                <button type="button" class="sm:w-32 w-full btn-secondary-remove-tmp">Delete</button>
            </template>
            <template #right>
                <button class="sm:w-32 w-full btn-secondary-tmp">Cancel</button>
                <button class="sm:w-48 w-full btn-tmp">Save</button>
            </template>
        </button-section>
    </base-view>
</template>

<script lang="ts">
    import SectionHeader from "@/components/common/section/SectionHeader.vue";
    import ButtonSection from "@/components/common/section/ButtonSection.vue";
    import { ref } from "vue";
    import LecturerSection from "@/components/common/dev/playground/course/LecturerSection.vue";
    import InfoSection from "@/components/common/dev/playground/course/InfoSection.vue";
    import Course from "@/api/api_models/course_management/Course";
    import { CourseType } from "@/entities/CourseType";
    import { Language } from "@/entities/Language";
    import RestrictionsSection from "@/components/common/dev/playground/course/RestrictionsSection.vue";
    import BaseView from "@/views/common/BaseView.vue";

    export default {
        name: "Playground",
        components: {
            InfoSection,
            BaseView,
            SectionHeader,
            ButtonSection,
            LecturerSection,
            RestrictionsSection,
        },
        setup() {
            const course = ref({
                courseType: CourseType.LECTURE,
                moduleIds: ["M1", "M2"],
                courseId: "course1",
                courseName: "Some Course Name",
                lecturerId: "lecturer",
                ects: 6,
                maxParticipants: 40,
                currentParticipants: 10,
                courseDescription: "This course has a description.",
                courseLanguage: Language.ENGLISH,
                startDate: "2020-06-17",
                endDate: "2020-09-25",
            } as Course);

            return {
                course,
            };
        },
    };
</script>
