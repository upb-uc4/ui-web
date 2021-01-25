<template>
    <div class="flex flex-wrap gap-y-2">
        <div v-for="(element, index) in elements" :key="index">
            <tag :title="propertyToDisplay ? element[propertyToDisplay] : element" @on-remove="onRemove(index)" />
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
            elements: {
                type: Array,
                default: () => [] as any[],
            },
            propertyToDisplay: {
                type: String,
                default: null,
            },
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
