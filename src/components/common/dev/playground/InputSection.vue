<template>
    <BaseSection
        title="Inputs"
        subtitle="This is really just a long subtitle to check the boundaries of the section. Don't mind the length. Thanks."
    >
        <div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">First Name</label>
                    <input type="text" class="w-full input-text-tmp" />
                </div>

                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Last Name</label>
                    <input type="text" class="w-full input-text-tmp" />
                </div>
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
