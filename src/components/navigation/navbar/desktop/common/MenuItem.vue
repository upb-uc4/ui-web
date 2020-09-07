<template>
    <button @click="onClick">
        <div class="flex items-center">
            <i class="fas text-lg text-blue-500 group-hover:text-blue-800 w-4" :class="iconClass" />
            <span class="ml-4">
                <span class="block font-bold text-blue-800 group-hover:text-blue-800 flex items-center">{{ title }}</span>
            </span>
            <div v-if="isHorizontallyAligned" class="ml-4">
                <span class="block text-sm text-gray-600 group-hover:text-blue-800">{{ description }}</span>
            </div>
        </div>
        <div v-if="!isHorizontallyAligned" class="ml-8">
            <span class="block text-sm text-gray-600 group-hover:text-blue-800">{{ description }}</span>
        </div>
    </button>
</template>

<script lang="ts">
    import Router from "@/use/router";

    export default {
        name: "GenericMenuItem",
        props: {
            title: {
                required: true,
                type: String,
            },
            description: {
                required: false,
                type: String,
                default: "",
            },
            iconClass: {
                required: true,
                type: String,
            },
            isHorizontallyAligned: {
                required: false,
                type: Boolean,
                default: false,
            },
            targetRouteName: {
                required: false,
                type: String,
                default: undefined,
            },
            action: {
                required: false,
                type: Function,
                default: () => {},
            },
        },
        setup(props: any) {
            function onClick() {
                props.action();
                if (props.targetRouteName != undefined) {
                    Router.push({ name: props.targetRouteName });
                }
            }

            return { onClick };
        },
    };
</script>
