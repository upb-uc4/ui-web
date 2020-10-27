<template>
    <div class="flex items-baseline w-full">
        <div v-for="(type, index) in types" :key="type" class="w-full">
            <button
                :id="'courseType-' + type"
                class="px-2 py-2 w-full text-gray-800 bg-gray-100 border-gray-200 shadow-md focus:outline-none hover:bg-blue-200"
                :class="{
                    'bg-blue-300 text-white hover:bg-blue-300 shadow-inner': selectedType === type,
                    'rounded-l': index === 0,
                    'rounded-r': index === types.length - 1,
                }"
                @click="select(type)"
            >
                <span class="sm:hidden">{{ shortNameFor(type) }}</span>
                <span class="hidden sm:flex justify-center">{{ type }}</span>
            </button>
        </div>
    </div>
</template>
<script lang="ts">
    import { CourseType } from "@/entities/CourseType";

    export default {
        name: "CourseTypeFilter",
        props: {
            selectedType: {
                type: String,
                required: true,
            },
        },
        emits: ["update:selectedType"],
        setup(props: any, { emit }: any) {
            let types = Object.values(CourseType).filter((e) => e != CourseType.NONE);
            types.unshift("All" as CourseType);

            function select(type: string) {
                emit("update:selectedType", type);
            }

            function shortNameFor(type: CourseType) {
                switch (type) {
                    case CourseType.PG: {
                        return "PG";
                    }
                    default: {
                        return type;
                    }
                }
            }

            return {
                types,
                select,
                shortNameFor,
            };
        },
    };
</script>
