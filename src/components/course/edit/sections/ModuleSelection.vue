<template>
    <div class="p-4 rounded-md border-2 border-gray-200 dark:border-normalgray-700">
        <div class="space-y-4">
            <tag-list :elements="['Module A', 'Module B']" />
            <span class="hidden input-label-warning">Please select at least one module.</span>
            <searchable-select placeholder="Search modules" :elements="temps" :selected="temp" />
        </div>
    </div>
</template>

<script lang="ts">
    import ExaminationRegulation from "@/api/api_models/exam_reg_management/ExaminationRegulation";
    import SearchSelectOption from "@/use/helpers/SearchSelectOption";
    import TagList from "@/components/common/TagList.vue";
    import { reactive, ref } from "vue";
    import SearchableSelect from "@/components/common/SearchableSelect.vue";

    export default {
        name: "ModuleSelection",
        props: {
            examinationRegulation: {
                type: Object as () => ExaminationRegulation,
                required: true,
            },
        },
        components: {
            TagList,
            SearchableSelect,
        },
        setup(props: any) {
            const temps = reactive([
                {
                    value: {},
                    display: "Module A",
                },
                {
                    value: {},
                    display: "Module B",
                },
                {
                    value: {},
                    display: "Module C",
                },
            ]);

            const temp = ref({ value: {}, display: "Module C" } as SearchSelectOption);
            return { temps, temp };
        },
    };
</script>
