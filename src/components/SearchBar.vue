<template>
    <div class="w-full relative text-gray-600 flex">
        <button id="refresh" class="items-center mb-3" title="Search" @click="$emit('refresh')">
            <i class="fas fa-search ml-3 absolute text-gray-600 hover:text-gray-700" />
        </button>
        <i class=""></i>
        <input
            id="message"
            v-model="filterMessage"
            class="w-full border-2 border-gray-300 bg-white h-12 px-12 rounded-lg focus:outline-none"
            type="search"
            placeholder="Filter"
        />
        <button id="refresh" class="-ml-8 my-1 focus:outline-none" title="Refresh" @click="$emit('refresh')">
            <i class="inline fas fa-redo-alt text-gray-600 hover:text-gray-700" />
        </button>
    </div>
</template>

<script lang="ts">
    import { useModelWrapper } from "@/use/ModelWrapper";

    export default {
        name: "SeachBar",
        props: {
            message: {
                type: String,
                required: true,
            },
        },
        emits: ["refresh"],
        setup(props: any, { emit }: any) {
            return {
                filterMessage: useModelWrapper(props, emit, "message"),
            };
        },
    };
</script>
