<template>
    <div class="w-64 flex flex-col justify-between rounded-md border-gray-200 dark:border-normalgray-700 border h-32 p-4 md:mx-0">
        <div class="">
            <div class="font-medium text-lg dark:text-gray-300 truncate">{{ moduleName }}</div>
            <div class="text-sm text-gray-500 truncate">{{ moduleIdentifier }}</div>
        </div>
        <div>
            <button :id="'removeModule' + moduleIdentifier" class="btn-tertiary-remove-tmp" @click="remove">Remove</button>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        name: "ModuleCard",
        props: {
            moduleIdentifier: {
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
                emit("remove", props.moduleIdentifier);
            }
            return {
                remove,
            };
        },
    };
</script>
