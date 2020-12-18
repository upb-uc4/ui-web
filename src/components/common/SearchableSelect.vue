<template>
    <div class="w-full max-w-xs">
        <Listbox v-model="matches" as="div" class="space-y-1">
            <ListboxLabel v-if="label" class="input-label-tmp">{{ label }} </ListboxLabel>
            <div class="relative">
                <span class="inline-block w-full">
                    <input
                        v-model="input"
                        type="text"
                        autocomplete="off"
                        class="w-64 input-text-tmp"
                        @focusin="hidden = false"
                        @focusout="hidden = true"
                    />
                </span>
                <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <div v-show="hasMatch && !hidden" class="absolute mt-1 w-full rounded-md bg-white shadow-lg">
                        <ListboxOptions
                            static
                            class="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                        >
                            <ListboxOption
                                v-for="element in matches"
                                :key="element"
                                v-slot="{ selected, active }"
                                :value="element"
                                @click="select(element)"
                            >
                                <div
                                    :class="`${
                                        active ? 'text-white bg-blue-600' : 'text-gray-900'
                                    } cursor-default select-none relative py-2 pl-8 pr-4`"
                                >
                                    <span :class="`${selected ? 'font-semibold' : 'font-normal'} block truncate`">
                                        {{ element.display }}
                                    </span>
                                    <span
                                        v-if="selected"
                                        :class="`${
                                            active ? 'text-white' : 'text-blue-600'
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
    import { computed, ref } from "vue";
    import SearchSelectOption from "@/use/helpers/SearchSelectOption";
    import { Listbox, ListboxLabel, ListboxOption, ListboxOptions } from "@headlessui/vue";

    export default {
        name: "SearchableSelect",
        components: {
            Listbox,
            ListboxLabel,
            ListboxOptions,
            ListboxOption,
        },
        props: {
            label: {
                type: String,
                default: "",
            },
            elements: {
                type: Array,
                required: true,
            },
            placeholder: {
                type: String,
                default: "Search for a Quote",
            },
        },
        emits: ["update:selected"],
        setup(props: any, { emit }: any) {
            const input = ref("");
            const hidden = ref(true);

            let matches = computed(() => {
                const elements = props.elements as SearchSelectOption[];
                return elements.filter((element) => {
                    const needle = input.value.toLowerCase();
                    const haystack = element.display.toLocaleLowerCase();
                    return haystack.includes(needle);
                });
            });

            let hasMatch = computed(() => matches.value.length > 0);

            function select(element: SearchSelectOption) {
                input.value = element.display;
                hidden.value = true;
                emit("update:selected", element);
            }

            //todo key listener (enter, up, down)

            return {
                input,
                matches,
                hasMatch,
                hidden,
                select,
            };
        },
    };
</script>
