<template>
    <div :id="'course_' + exam?.examId" class="">
        <div class="flex items-center justify-between sm:justify-start space-x-4">
            <div class="flex items-center space-x-2">
                <span
                    class="w-3 h-3 rounded-full"
                    :class="[{ 'bg-lime-400': exam?.type === 'Written Exam' }, { 'bg-yellow-400': exam?.type === 'Oral Exam' }]"
                />
                <span class="text-xs font-medium tracking-wide text-gray-500">{{ exam?.type }}</span>
            </div>

            <div class="text-xs font-medium tracking-wide text-gray-500 uppercase">{{ exam?.ects }} ECTS</div>
            <div class="hidden sm:flex ml-4 text-xs font-medium tracking-wide text-gray-500">
                {{ course?.courseLanguage }}
            </div>
        </div>

        <div class="mt-2 flex flex-col">
            <div>
                <label id="courseId" class="text-lg navigation-link font-bold" @click="viewExam()"> Exam: {{ courseName }} </label>
            </div>
            <label id="date" class="mt-1 font-semibold text-gray-500"> Date: {{ examDate }} </label>
            <label class="mt-1 flex text-gray-500">
                Course:
                <p class="ml-2 navigation-link cursor-pointer" @click.stop="viewCourse()">{{ courseName }}</p>
            </label>
            <label id="module" class="mt-1 text-gray-500"> Module: {{ exam?.moduleId }} </label>
            <div
                id="toggleDeadlines"
                class="mt-1 text-gray-500 flex cursor-pointer items-baseline"
                :title="deadlinesShown ? 'Collapse' : 'Expand'"
                @click="toggleDeadlinesDisplay"
            >
                Deadlines
                <i class="ml-2 text-sm" :class="deadlinesShown ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" />
            </div>
            <div v-if="deadlinesShown" class="flex flex-col mt-1">
                <label id="admitUntil" :class="isAdmittable ? 'text-green-400' : 'text-red-400'" class="mt-1 pl-8 text-gray-500">
                    Admission Deadline: {{ admittableUntilFormatted }}
                </label>
                <label id="dropUntil" :class="isDroppable ? 'text-green-400' : 'text-red-400'" class="mt-1 pl-8 text-gray-500">
                    Drop Deadline: {{ droppableUntilFormatted }}
                </label>
            </div>
        </div>
        <div v-if="isStudent" class="flex justify-end mt-2">
            <button v-if="!isAdmitted && isAdmittable" class="btn btn-add w-full sm:w-24" @click="admit">Admit</button>
            <button v-else-if="isAdmitted && isDroppable" class="btn btn-remove sm:w-24" @click="drop">Drop</button>
        </div>
    </div>
</template>

<script lang="ts">
    import Course from "@/api/api_models/course_management/Course";
    import Router from "@/use/router";
    import { ref } from "vue";

    import Exam from "../mockExamInterface";

    export default {
        name: "ExamRow",
        components: {},
        props: {
            isStudent: {
                type: Boolean,
                required: true,
            },
            examAdmissions: {
                type: Array,
                required: false,
                default: () => [],
            },
            exam: {
                type: Object as () => Exam,
                required: true,
            },
            course: {
                type: Object as () => Course,
                required: true,
            },
        },
        setup(props: any) {
            const courseName = ref(props.course.courseName);

            const dateFormatOptions = {
                weekday: "short",
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            };
            const examDate = new Date(props.exam.date).toLocaleString("en-US", dateFormatOptions);
            const admittableUntilFormatted = new Date(props.exam.admittableUntil).toLocaleString("en-US", dateFormatOptions);
            const droppableUntilFormatted = new Date(props.exam.droppableUntil).toLocaleString("en-US", dateFormatOptions);
            const deadlinesShown = ref(false);

            const isAdmitted = ref((props.examAdmissions as any[]).some((admission) => admission.examId == props.exam.examId));
            const now = new Date();
            const isAdmittable = now < new Date(props.exam.admittableUntil);
            const isDroppable = now < new Date(props.exam.droppableUntil);

            function toggleDeadlinesDisplay() {
                deadlinesShown.value = !deadlinesShown.value;
            }

            function viewExam() {
                //TODO
                Router.push({ name: "exams.view", params: { id: props.exam.examId } });
            }

            function viewCourse() {
                Router.push({ path: "/editCourse/" + props.course.courseId });
            }

            async function admit() {
                //TODO API
                //if success
                isAdmitted.value = true;
            }

            async function drop() {
                //TODO API
                //if success
                isAdmitted.value = false;
            }

            return {
                viewExam,
                viewCourse,
                toggleDeadlinesDisplay,
                deadlinesShown,
                courseName,
                examDate,
                admittableUntilFormatted,
                droppableUntilFormatted,
                isAdmitted,
                isAdmittable,
                isDroppable,
                admit,
                drop,
            };
        },
    };
</script>
