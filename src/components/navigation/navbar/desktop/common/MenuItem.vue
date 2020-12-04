<template>
    <router-link :to="{ name: targetRouteName }" class="cursor-pointer" @click="onClick($event)">
        <div class="rounded-lg font-normal text-base hover:bg-gray-200" :class="[isHorizontallyAligned ? 'p-2' : 'p-2']">
            <div class="flex items-center">
                <i class="absolute fas text-blue-600 text-xl" :class="iconClass" />
                <span class="ml-10">
                    <span class="block text-gray-800 font-semibold text-sm">{{ title }}</span>
                </span>
                <div v-if="isHorizontallyAligned" class="ml-4">
                    <span class="block text-gray-500 text-sm">{{ description }}</span>
                </div>
            </div>
            <div v-if="!isHorizontallyAligned" class="ml-10">
                <span class="block text-gray-500 text-sm">{{ description }}</span>
            </div>
        </div>
    </router-link>
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
            async function onClick(event: Event) {
                event.preventDefault();
                await props.action();
                if (props.targetRouteName != undefined) {
                    Router.push({ name: props.targetRouteName });
                }
            }

            return { onClick };
        },
    };
</script>
