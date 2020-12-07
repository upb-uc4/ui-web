<template>
    <BaseSection title="Public Picture" subtitle="Click on the image to either unset your current profile picture or to set a new one.">
        <div class="w-32 h-32 relative text-center cursor-pointer">
            <Menu>
                <MenuButton class="focus:outline-none" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
                    <img
                        class="w-32 h-32 object-cover rounded-full"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8d29tYW58ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80"
                    />
                    <div v-show="isHovered">
                        <div class="absolute top-0 left-0 w-32 h-32 rounded-full bg-black opacity-50" />
                        <div class="absolute top-24 left-0 w-full text-white text-sm font-medium tracking-wider">Change</div>
                    </div>
                </MenuButton>

                <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-out"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                >
                    <MenuItems
                        class="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                    >
                        <div class="py-1">
                            <MenuItem v-slot="{ active }">
                                <span
                                    :class="active ? 'text-white bg-blue-600 font-semibold' : 'text-gray-900 font-normal'"
                                    class="flex justify-between w-full py-2 pl-8 pr-4 text-sm leading-5 text-left"
                                >
                                    Remove photo
                                </span>
                            </MenuItem>
                            <MenuItem v-slot="{ active }">
                                <span
                                    :class="active ? 'text-white bg-blue-600 font-semibold' : 'text-gray-900 font-normal'"
                                    class="flex justify-between w-full py-2 pl-8 pr-4 text-sm leading-5 text-left"
                                >
                                    Upload a photo
                                </span>
                            </MenuItem>
                        </div>
                    </MenuItems>
                </transition>
            </Menu>
        </div>
    </BaseSection>
</template>

<script>
    import BaseSection from "@/components/common/section/BaseSection";
    import { ref } from "vue";
    import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

    export default {
        name: "InputSection",
        components: {
            Menu,
            MenuButton,
            MenuItems,
            MenuItem,
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
