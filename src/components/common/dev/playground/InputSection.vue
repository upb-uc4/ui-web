<template>
    <BaseSection title="Inputs" subtitle="Examples for all inputs used in UC4.">
        <div class="space-y-6">
            <div class="">
                <label class="input-label-tmp">default</label>
                <input type="text" autofocus class="w-64 input-text-tmp" value="empty" />
            </div>
        </div>
    </BaseSection>
</template>

<script>
    import BaseSection from "@/components/common/section/BaseSection";

    export default {
        name: "InputSection",
        components: {
            BaseSection,
        },
    };
</script>
