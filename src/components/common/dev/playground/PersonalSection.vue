<template>
    <BaseSection
        title="Personal Information"
        subtitle="You may not update this information on your own. In case some of your personal information has changed, please contact our support staff."
    >
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">First Name</label>
                    <input type="text" class="w-full input-text-tmp" readonly value="Max" />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Last Name</label>
                    <input type="text" class="w-full input-text-tmp" readonly value="Mustermann" />
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Date of Birth</label>
                    <input type="text" class="w-full input-text-tmp" readonly value="24.05.1993" />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
        </div>
    </BaseSection>
</template>

<script>
    import BaseSection from "@/components/common/section/BaseSection";
    import { ref } from "vue";

    export default {
        name: "InputSection",
        components: {
            BaseSection,
        },
        setup() {
            return {};
        },
    };
</script>
