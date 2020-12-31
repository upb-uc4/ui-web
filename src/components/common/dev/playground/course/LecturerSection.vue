<template>
    <BaseSection subtitle="Select the lecturer that will hold the course." title="Lecturer">
        <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
            <div class="lg:w-1/2 w-full">
                <searchableSelect :label="'Lecturer-ID'" :elements="myLecturers" @update:selected="updateLecturerId" />
                <label v-if="errorBag.has('lecturerId')" class="input-label-warning-tmp">
                    {{ errorBag.get("lecturerId") }}
                </label>
                <div :hidden="Object.keys(currentLecturer).length === 0" class="text-gray-700 text-md font-medium my-3">
                    <label v-if="currentLecturer.username">
                        <i class="text-green-400 fas fa-check mr-2"></i>
                        {{ currentLecturer.firstName }} {{ currentLecturer.lastName }} (
                        <router-link
                            class="navigation-link cursor-pointer hover:underline"
                            target="_blank"
                            :to="{ name: 'profile.public', params: { username: currentLecturer.username } }"
                        >
                            @{{ currentLecturer.username }}
                        </router-link>
                        )
                    </label>
                    <label v-else>
                        <i class="text-red-400 fas fa-times mr-2"></i>
                        Lecturer-ID not found!
                    </label>
                </div>
            </div>
            <div class="lg:w-1/2 w-full invisible" />
        </div>
    </BaseSection>
</template>

<script lang="ts">
    import SearchableSelect from "@/components/common/SearchableSelect.vue";
    import BaseSection from "@/components/common/section/BaseSection.vue";
    import { computed, onBeforeMount, ref } from "vue";
    import SearchSelectOption from "@/use/helpers/SearchSelectOption";
    import Lecturer from "@/api/api_models/user_management/Lecturer";
    import UserManagement from "@/api/UserManagement";
    import GenericResponseHandler from "@/use/helpers/GenericResponseHandler";
    import { Role } from "@/entities/Role";
    import ErrorBag from "@/use/helpers/ErrorBag";

    export default {
        name: "Lecturer",
        components: {
            BaseSection,
            SearchableSelect,
        },
        props: {
            lecturerId: {
                type: String,
                required: true,
            },
            errorBag: {
                type: Object as () => ErrorBag,
                required: true,
            },
        },
        emits: ["update:lecturerId"],
        setup(props: any, { emit }: any) {
            const lecturers = ref([] as Lecturer[]);

            const currentLecturer = ref({} as Lecturer);

            const myLecturers = computed(() =>
                lecturers.value.map((l: Lecturer) => {
                    return {
                        value: l,
                        display: createOptionString(l),
                    } as SearchSelectOption;
                })
            );

            onBeforeMount(async () => {
                await getLecturers();
            });

            async function getLecturers() {
                const userManagement: UserManagement = new UserManagement();
                const handler = new GenericResponseHandler("lecturers");
                const response = await userManagement.getUsers(Role.LECTURER);
                const result = handler.handleResponse(response);
                if (result) {
                    lecturers.value = result as Lecturer[];
                    if (props.lecturerId != "") {
                        const initialLecturer = lecturers.value.find((l) => l.username === props.lecturerId);
                        if (initialLecturer) {
                            currentLecturer.value = initialLecturer;
                        }
                    }
                }
            }

            function updateLecturerId(element: any) {
                currentLecturer.value = element.value as Lecturer;
                emit("update:lecturerId", currentLecturer.value.username);
            }

            function createOptionString(l: Lecturer): string {
                return `${l.firstName} ${l.lastName} (@${l.username})`;
            }

            return {
                updateLecturerId,
                myLecturers,
                currentLecturer,
            };
        },
    };
</script>
