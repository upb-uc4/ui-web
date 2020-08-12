<template>
    <div
        class="w-full px-4 py-4 whitespace-no-wrap border-gray-300 border-2 bg-gray-100"
        :class="{ 'rounded-t-lg': isFirstRow, 'rounded-b-lg': isLastRow, 'border-b': !isLastRow }"
    >
        <div class="flex items-center justify-between">
            <div class="flex items-start">
                <div class="text font-medium text-gray-600 mb-1 lg:w-48 w-32 truncate">
                    {{ semester }}
                </div>
                <div class="flex-col">
                    <div v-for="fieldOfStudy in fieldsOfStudy" :key="fieldOfStudy" class="leading-5 text-gray-600">{{ fieldOfStudy }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import SubjectMatriculation from "@/api/api_models/matriculation_management/SubjectMatriculation";
    import { FieldOfStudy } from "@/api/api_models/user_management/FieldOfStudy";

    export default {
        name: "ImmatriculationHistoryEntry",
        props: {
            semester: {
                type: String,
                required: true,
            },
            fieldsOfStudy: {
                type: Array,
                required: true,
            },
            isLastRow: {
                type: Boolean,
            },
            isFirstRow: {
                type: Boolean,
            },
        },
        setup(props: any) {},
    };
</script>
