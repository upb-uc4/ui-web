<template>
    <BaseSection title="Contact" subtitle="How can we reach you?">
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Email</label>
                    <input type="text" class="w-full input-text-tmp" readonly value="example@cs.uc4.upb.de" />
                </div>
                <div class="lg:w-1/2 w-full" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Phone</label>
                    <input type="text" class="w-full input-text-tmp" readonly value="+0900666666" />
                </div>
                <div class="lg:w-1/2 w-full" />
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
