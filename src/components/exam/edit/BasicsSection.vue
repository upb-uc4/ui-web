<template>
    <BaseSection title="Basic Information" subtitle="Course, module and credit points that the exam should be assigned to.">
        <div v-if="!isLoading" class="lg:w-1/2">
            <label class="input-label">Course</label>
            <input v-if="viewMode" id="shownCourse" disabled class="form-input input-text w-full" :value="selectedCourse.courseName" />
            <div v-else>
                <selection id="select_course" v-model:selection="selectedCourse" :elements="courses" property-to-display="courseName" />
                <label v-if="errorBag?.has('courseId')" class="input-label-error">
                    {{ errorBag.get("courseId") }}
                </label>
            </div>
            <label class="input-label mt-5">Module</label>
            <input v-if="viewMode" id="shownModule" disabled class="form-input input-text w-full" :value="selectedModule" />
            <div v-else>
                <Select
                    id="moduleSelect"
                    v-model:selection="selectedModule"
                    :title="enableModuleSelection ? '' : 'Please select a course first'"
                    :disabled="!enableModuleSelection"
                    :elements="availableModules"
                />
                <label v-if="errorBag?.has('moduleId')" class="input-label-error">
                    {{ errorBag.get("moduleId") }}
                </label>
            </div>
            <label class="input-label mt-5">ECTS</label>
            <input id="ects" v-model="myEcts" type="number" :disabled="viewMode" class="form-input input-text w-full" />
            <label v-if="errorBag?.has('ects')" class="input-label-error">
                {{ errorBag.get("ects") }}
            </label>
            <div class="mt-8">
                <ISODatePicker
                    v-model:iso-date="myExamDate"
                    id-prefix="examDate_"
                    :disabled="viewMode"
                    :view-mode="viewMode"
                    title="Exam Date"
                />
                <label v-if="errorBag?.has('examDate')" class="input-label-error">
                    {{ errorBag.get("examDate") }}
                </label>
            </div>
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import ErrorBag from "@/use/helpers/ErrorBag";
    import { computed, onBeforeMount, ref, watch } from "vue";
    import Course from "@/api/api_models/course_management/Course";
    import Selection from "@/components/common/ObjectSelect.vue";
    import Select from "@/components/common/Select.vue";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";
    import ISODatePicker from "@/components/common/ISODatePicker.vue";

    export default {
        name: "CourseModuleSection",
        components: {
            BaseSection,
            Selection,
            Select,
            ISODatePicker,
        },
        props: {
            errorBag: {
                required: true,
                type: ErrorBag,
            },
            examDate: {
                type: String,
                required: true,
            },
            courseId: {
                type: String,
                required: true,
            },
            moduleId: {
                type: String,
                required: true,
            },
            ects: {
                type: Number,
                required: true,
            },
            courses: {
                type: Object as () => Course[],
                required: true,
            },
            viewMode: {
                type: Boolean,
                required: true,
            },
        },
        emits: ["update:course-id", "update:module-id", "update:ects", "update:examDate"],
        setup(props: any, { emit }: any) {
            const isLoading = ref(false);
            const selectedCourse = ref();
            const selectedModule = ref("");
            const myEcts = ref(props.ects);
            const availableModules = ref([] as String[]);

            const enableModuleSelection = computed(() => {
                return availableModules.value.length > 0;
            });

            onBeforeMount(async () => {
                isLoading.value = true;
                selectedCourse.value = getCourse();
                if (selectedCourse.value) {
                    availableModules.value = (selectedCourse.value as Course)?.moduleIds;
                    selectedModule.value = props.moduleId;
                }
                isLoading.value = false;
            });

            watch(selectedCourse, () => {
                if (!props.viewMode) {
                    emit("update:course-id", selectedCourse.value.courseId);
                    selectedModule.value = "";
                    availableModules.value = (selectedCourse.value as Course).moduleIds;
                }
            });

            watch(selectedModule, () => {
                if (!props.viewMode) {
                    emit("update:module-id", selectedModule.value);
                }
            });

            watch(myEcts, () => {
                if (!props.viewMode) {
                    emit("update:ects", parseInt(myEcts.value));
                }
            });

            function getCourse() {
                return (props.courses as Course[]).filter((course) => course.courseId == props.courseId)[0];
            }

            return {
                isLoading,
                selectedCourse,
                selectedModule,
                availableModules,
                enableModuleSelection,
                myEcts,
                myExamDate: useModelWrapper(props, emit, "examDate"),
            };
        },
    };
</script>
