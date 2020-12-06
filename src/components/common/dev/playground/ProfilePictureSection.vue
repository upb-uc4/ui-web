<template>
    <BaseSection title="Public Picture" subtitle="Click on the image to either unset your current profile picture or to set a new one.">
        <div class="w-32 h-32 relative text-center cursor-pointer">
            <img
                class="w-32 h-32 object-cover rounded-full"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8d29tYW58ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80"
                @mouseenter="isHovered = true"
                @mouseleave="isHovered = false"
            />
            <div v-show="isHovered">
                <div class="absolute top-0 left-0 w-32 h-32 rounded-full bg-black opacity-50" />
                <div class="absolute top-24 left-0 w-full text-white text-sm font-medium tracking-wider">Change</div>
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
            const isHovered = ref(false);

            return {
                isHovered,
            };
        },
    };
</script>
