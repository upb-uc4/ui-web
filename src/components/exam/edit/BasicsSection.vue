<template>
    <BaseSection title="Basic Information" subtitle="Course, module and credit points that the exam should be assigned to.">
        <div v-if="!isLoading">
            <label class="input-label">Course</label>
            <selection
                id="select_course"
                v-model:selection="selectedCourse"
                :disabled="viewMode"
                :elements="courses"
                property-to-display="courseName"
            />
            <label v-if="errorBag?.has('courseId')" class="input-label-error">
                {{ errorBag.get("courseId") }}
            </label>
            <div class="lg:flex justify-between">
                <div class="flex-col w-full lg:w-1/2">
                    <label class="input-label mt-5">Module</label>
                    <Select
                        id="module"
                        v-model:selection="selectedModule"
                        :title="enableModuleSelection ? '' : 'Please select a course first'"
                        :disabled="!enableModuleSelection || viewMode"
                        :elements="availableModules"
                    />
                    <label v-if="errorBag?.has('moduleId')" class="input-label-error">
                        {{ errorBag.get("moduleId") }}
                    </label>
                </div>
                <div class="flex-col w-full lg:w-1/3">
                    <label class="input-label mt-5">ECTS</label>
                    <input id="ects" v-model="myEcts" type="number" :disabled="viewMode" class="w-full form-input input-text" />
                    <label v-if="errorBag?.has('ects')" class="input-label-error">
                        {{ errorBag.get("ects") }}
                    </label>
                </div>
            </div>
            <div class="lg:w-1/2 mt-8">
                <ISODatePicker v-model:iso-date="myExamDate" id-prefix="examDate_" :disabled="viewMode" title="Exam Date" />
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
            const selectedModule = ref(props.moduleId);
            const myEcts = ref(props.ects);
            const availableModules = ref([] as String[]);

            const enableModuleSelection = computed(() => {
                return availableModules.value.length > 0;
            });

            onBeforeMount(async () => {
                isLoading.value = true;
                if (props.viewMode) {
                    selectedCourse.value = getCourse();
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
                    emit("update:module-id", selectedCourse.value.courseId);
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
