<template>
    <div class="flex">
        <div v-for="(element, index) in elements" :key="index">
            <tag :title="element" @on-remove="onRemove(index)" />
        </div>
    </div>
</template>

<script lang="ts">
    import Tag from "@/components/common/Tag.vue";

    export default {
        name: "TagList",
        components: {
            Tag,
        },
        props: {
            elements: Array,
            default: () => [],
        },
        emits: ["on-remove"],
        setup(props: any, { emit }: any) {
            function onRemove(index: Number) {
                emit("on-remove", index);
            }
            return {
                onRemove,
            };
        },
    };
</script>
