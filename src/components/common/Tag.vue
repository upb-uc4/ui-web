<template>
    <span class="mr-2 text-sm font-medium py-1 px-2 rounded align-middle" :class="[bgColor, computedBgColor, textColor]">
        {{ title }}
        <i :id="'remove_' + title" class="fa fa-times pl-1 cursor-pointer remove-tag" @click="remove" />
    </span>
</template>

<script lang="ts">
    import { computed } from "vue";

    export default {
        name: "Tag",
        props: {
            title: {
                type: String,
                required: true,
            },
            bgColor: {
                type: String,
                default: "bg-blue-200 dark:bg-lime-700",
            },
            hoverBgColor: {
                type: String,
                default: "bg-blue-300",
            },
            textColor: {
                type: String,
                default: "text-blue-700 dark:text-lime-200",
            },
        },
        emits: ["on-remove"],
        setup(props: any, { emit }: any) {
            let computedBgColor = computed(() => "hover:" + props.hoverBgColor);
            const remove = () => {
                emit("on-remove");
            };
            return {
                computedBgColor,
                remove,
            };
        },
    };
</script>
