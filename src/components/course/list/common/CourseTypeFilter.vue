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
                <span class="sm:hidden">{{ type }}</span>
                <span class="hidden sm:flex justify-center">{{ type }}</span>
            </button>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue, { onMounted, ref } from "vue";
    import { useStore } from "@/use/store/store";
    import { useToast } from "@/toast";

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
                await store.getters.configuration
                    .then((config) => {
                        types.value = config.courseTypes;
                        types.value.unshift("All");
                    })
                    .catch((reason) => {
                        const toast = useToast();
                        toast.error(reason);
                    });
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
