<template>
    <div class="w-full">
        <Listbox v-slot="{ open }" v-model="mySelection" as="div" class="space-y-1">
            <div class="relative">
                <span class="inline-block w-full relative">
                    <div v-if="disabled" class="relative">
                        <input class="w-full input-text-tmp" :value="mySelection" readonly />
                    </div>
                    <ListboxButton
                        v-else
                        :id="id"
                        class="relative input-base-tmp dark:border-normalgray-900 w-full pr-10 text-left focus:outline-none focus:border-blue-600 transition ease-in-out duration-150"
                    >
                        <span class="block truncate">
                            <span v-if="label" class="text-gray-600 font-medium">
                                {{ label }}:
                                <span class="font-medium text-gray-900 dark:text-gray-300">{{ mySelection }}</span>
                            </span>
                            <span v-else-if="mySelection" class="dark:text-gray-300">{{ mySelection }}</span>
                            <span v-else class="dark:text-gray-300">{{ placeholder }}</span>
                        </span>
                    </ListboxButton>
                    <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                </span>
                <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <div v-if="open" class="absolute z-30 mt-1 w-full rounded-md bg-white dark:bg-normalgray-800 shadow-lg">
                        <ListboxOptions
                            static
                            class="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                        >
                            <ListboxOption
                                v-for="element in elements"
                                :id="id + 'Item-' + element"
                                :key="element"
                                v-slot="{ selected, active }"
                                :value="element"
                            >
                                <div
                                    :class="`${
                                        active
                                            ? 'text-white dark:text-gray-300 bg-blue-600 dark:bg-blue-700'
                                            : 'text-gray-900 dark:text-gray-300'
                                    } cursor-default select-none relative py-2 pl-8 pr-4`"
                                >
                                    <span :class="`${selected ? 'font-semibold' : 'font-normal'} block truncate`">
                                        {{ element }}
                                    </span>
                                    <span
                                        v-if="selected"
                                        :class="`${
                                            active ? 'text-white dark:text-gray-300' : 'text-blue-600 dark:text-blue-700'
                                        } absolute inset-y-0 left-0 flex items-center pl-1.5`"
                                    >
                                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </ListboxOption>
                        </ListboxOptions>
                    </div>
                </transition>
            </div>
        </Listbox>
    </div>
</template>

<script lang="ts">
    import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
    import { useModelWrapper } from "@/use/helpers/ModelWrapper";

    export default {
        name: "Select",
        components: {
            Listbox,
            ListboxButton,
            ListboxOptions,
            ListboxOption,
        },
        props: {
            placeholder: {
                type: String,
                default: "Click to select",
            },
            label: {
                type: String,
                default: "",
            },
            elements: {
                type: Array,
                required: true,
            },
            selection: {
                type: String,
                required: true,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            id: {
                type: String,
                required: true,
            },
        },
        emits: ["update:selection"],
        setup(props: any, { emit }: any) {
            return {
                mySelection: useModelWrapper(props, emit, "selection"),
            };
        },
    };
</script>
