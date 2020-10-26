<template>
    <div class="flex items-baseline w-1/2 mb-3">
        <div v-for="(type, index) in types" :key="type" class="mb-3">
            <label class="inline-flex">
                <button
                    :id="'courseType-' + type"
                    class="px-4 py-2 text-gray-800 bg-gray-100 border-gray-200 shadow-md focus:outline-none hover:bg-blue-200"
                    :class="{
                        'bg-blue-300 text-white hover:bg-blue-300 shadow-inner': selectedType == type,
                        'rounded-l': index == 0,
                        'rounded-r': index == types.length - 1,
                    }"
                    @click="select(type)"
                >
                    {{ type }}
                </button>
            </label>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue, { onMounted, ref } from "vue";
    import { useStore } from "@/use/store/store";

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
            const types = ref([] as string[]);

            onMounted(async () => {
                const store = useStore();
                types.value = [...(await store.getters.configuration).courseTypes];
                types.value.unshift("All");
            });

            function select(type: string) {
                emit("update:selectedType", type);
            }

            return {
                types,
                select,
            };
        },
    };
</script>
