<template>
    <div class="w-56 rounded-md border-gray-200 dark:border-normalgray-700 border h-32 p-4 mx-auto md:mx-0">
        <div class="font-medium text-lg dark:text-gray-300">{{ moduleId }}</div>
        <div class="text-sm text-gray-700 dark:text-gray-500">{{ moduleName }}</div>
        <div>
            <button class="btn-tertiary-remove-tmp" @click="remove">Remove</button>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        name: "ModuleCard",
        props: {
            moduleId: {
                type: String,
                required: true,
            },
            moduleName: {
                type: String,
                required: true,
            },
        },
        emits: ["remove"],
        setup(props: any, { emit }: any) {
            function remove() {
                emit("remove", props.moduleId);
            }
            return {
                remove,
            };
        },
    };
</script>
