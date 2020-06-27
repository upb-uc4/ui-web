<template>
    <teleport to="#modal-wrapper">
        <transition name="fade">
            <div v-show="showing" class="fixed w-full h-full top-0 left-0 flex items-center justify-center">
                <div class="absolute w-full h-full bg-gray-900 opacity-25"/>

                <div class="bg-white w-full -mt-32 md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto rounded-lg shadow-xl z-50 overflow-y-auto">

                    <div class="py-8 px-10">
                        <div class="flex justify-between items-center">
                            <slot name="header"></slot>
                            <button class="cursor-pointer z-50 focus:outline-none" @click="$emit('cancel')">
                                <svg class="fill-current text-gray-600 hover:text-gray-700" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 18 18">
                                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="flex mt-4 mr-8 text-lg text-gray-600 leading-relaxed tracking-wide">
                            <slot></slot>
                        </div>
                    </div>

                    <div class="bg-gray-200 h-20 flex items-center justify-end">
                        <div class="flex justify-end mr-10">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script lang="ts">
    export default {
        props: {
            showing: {
                required: true,
                type: Boolean,
            }
        },
        emits: ['cancel'],
        setup() {

        }
    }
</script>

<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.25s;
    }
    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }
</style>