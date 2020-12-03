<template>
    <BaseSection
        title="Inputs"
        subtitle="This is really just a long subtitle to check the boundaries of the section. Don't mind the length. Thanks."
    >
        <div class="space-y-6">
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">First Name</label>
                    <input type="text" class="w-full input-text-tmp" />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Last Name</label>
                    <input type="text" class="w-full input-text-tmp" placeholder="This one has a placeholder." />
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Already filled</label>
                    <input type="text" class="w-full input-text-tmp" value="This one is already filled." />
                </div>
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Read only</label>
                    <input type="text" class="w-full input-text-tmp" readonly value="Read only." />
                </div>
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <label class="input-label-tmp">Disabled</label>
                    <input type="text" class="w-full input-text-tmp" disabled value="Disabled." />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="lg:w-1/2 w-full">
                    <Select v-model:elements="people" :selected-element="selectedPerson" />
                </div>
                <div class="lg:w-1/2 w-full invisible" />
            </div>
            <!--            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">-->
            <!--                <div class="lg:w-1/2 w-full">-->
            <!--                    <label class="input-label-warning-tmp">Warning</label>-->
            <!--                    <input type="text" class="w-full input-text-warning-tmp" />-->
            <!--                </div>-->
            <!--                <div class="lg:w-1/2 w-full">-->
            <!--                    <label class="input-label-error-tmp">Error</label>-->
            <!--                    <input type="text" class="w-full input-text-error-tmp" />-->
            <!--                </div>-->
            <!--            </div>-->
            <div class="lg:flex lg:space-x-12 lg:space-y-0 space-y-4 w-full">
                <div class="w-full">
                    <label class="input-label-tmp">Comment</label>
                    <textarea rows="4" class="w-full input-text-tmp" />
                </div>
            </div>
        </div>
    </BaseSection>
</template>

<script>
    import BaseSection from "@/components/common/section/BaseSection";
    import Select from "@/components/common/Select";
    import { ref } from "vue";

    export default {
        name: "InputSection",
        components: {
            BaseSection,
            Select,
        },
        setup() {
            const people = [
                "Wade Cooper",
                "Arlene Mccoy",
                "Devon Webb",
                "Tom Cook",
                "Tanya Fox",
                "Hellen Schmidt",
                "Caroline Schultz",
                "Mason Heaney",
                "Claudie Smitham",
                "Emil Schaefer",
            ];
            const selectedPerson = ref(people[0]);
            return { people, selectedPerson };
        },
    };
</script>
