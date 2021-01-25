<template>
    <BaseSection subtitle="Select the lecturer that will hold the course." title="Lecturer">
        <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
            <div class="lg:w-1/2 w-full">
                <searchableSelect
                    :id="'lecturerId'"
                    label="Lecturer-ID"
                    :placeholder="currentSelection.display"
                    :elements="myLecturers"
                    :selected="currentSelection"
                    @update:selected="updateLecturer"
                />
                <label v-if="errorBag.has('lecturerId')" id="lecturerIdLabel" class="input-label-error">
                    {{ errorBag.get("lecturerId") }}
                </label>
                <div v-if="currentSelection.value !== undefined" class="text-gray-700 text-md font-medium my-3">
                    <label v-if="currentSelection.value.username" class="input-label">
                        <i class="text-green-400 dark:text-lime-500 fas fa-check mr-2"></i>
                        {{ currentSelection.value.firstName }} {{ currentSelection.value.lastName }} (
                        <router-link
                            class="navigation-link cursor-pointer hover:underline"
                            target="_blank"
                            :to="{ name: 'profile.public', params: { username: currentSelection.value.username } }"
                        >
                            @{{ currentSelection.value.username }}
                        </router-link>
                        )
                    </label>
                    <label v-else class="input-label-error">
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

            const currentSelection = ref({} as SearchSelectOption);

            const selectableLecturers = computed(() =>
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
                            currentSelection.value = {
                                display: createOptionString(initialLecturer),
                                value: initialLecturer,
                            } as SearchSelectOption;
                        }
                    }
                }
            }

            function updateLecturer(element: SearchSelectOption) {
                currentSelection.value = element;
                const lecturerId = (currentSelection.value.value as Lecturer).username;
                emit("update:lecturerId", lecturerId);
            }

            function createOptionString(l: Lecturer): string {
                return `${l.firstName} ${l.lastName} (@${l.username})`;
            }

            return {
                updateLecturer,
                myLecturers: selectableLecturers,
                currentSelection,
            };
        },
    };
</script>
