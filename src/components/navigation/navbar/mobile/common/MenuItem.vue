<template>
    <div class="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-800" @click="onClick">
        <i class="fas text-lg text-gray-100 w-4" :class="iconClass" />
        <span class="ml-4">
            <span class="block text-sm text-gray-100 flex items-center">{{ title }}</span>
        </span>
    </div>
</template>

<script lang="ts">
    import Router from "@/use/router";

    export default {
        name: "GenericMobileMenuItem",
        props: {
            title: {
                required: true,
                type: String,
            },
            iconClass: {
                required: true,
                type: String,
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
