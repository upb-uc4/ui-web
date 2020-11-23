<template>
    <div :class="{ dark: isDarkModeEnabled }">
        <div class="bg-gray-100 dark:bg-gray-800 p-10 mt-10 rounded-lg w-full sm:flex justify-between">
            <div>
                <h1 class="font-medium text-2xl text-gray-600 dark:text-blue-200 mb-2">Inputs</h1>
                <div class="">
                    <label class="input-label-tmp">default</label>
                    <input type="text" autofocus class="w-64 input-text-tmp" value="empty" />
                </div>

                <div class="mt-6">
                    <label class="input-label-tmp">placeholder</label>
                    <input type="text" class="w-64 input-text-tmp" placeholder="empty" />
                </div>

                <div class="mt-6">
                    <label class="input-label-tmp">disabled</label>
                    <input type="text" disabled class="w-64 input-text-tmp" value="empty" />
                </div>

                <div class="mt-6">
                    <label class="input-label-tmp">readonly</label>
                    <input type="text" readonly class="w-64 input-text-tmp" value="empty" />
                </div>

                <div class="mt-6">
                    <label class="input-label-tmp">error</label>
                    <input type="text" class="w-64 input-text-error-tmp" value="empty" />
                    <label class="input-label-error-tmp">This indicates that something is wrong.</label>
                </div>

                <div class="mt-6">
                    <label class="input-label-tmp">warning</label>
                    <input type="text" class="w-64 input-text-warning-tmp" value="empty" />
                    <label class="input-label-warning-tmp">This is a warning.</label>
                </div>
            </div>

            <div class="mt-12 sm:mt-0">
                <div>
                    <h1 class="font-medium text-2xl text-gray-600 mb-2">Primary Buttons</h1>
                    <div class="sm:flex">
                        <div class="sm:mr-8">
                            <div class="">
                                <label class="input-label-tmp">default</label>
                                <button class="w-64 btn-tmp">Click Me</button>
                            </div>

                            <div class="mt-6">
                                <label class="input-label-tmp">add</label>
                                <button class="w-64 btn-add-tmp">Click Me</button>
                            </div>

                            <div class="mt-6">
                                <label class="input-label-tmp">remove</label>
                                <button class="w-64 btn-remove-tmp">Click Me</button>
                            </div>
                        </div>
                        <div class="sm:mt-0 mt-6">
                            <div class="">
                                <label class="input-label-tmp">default disabled</label>
                                <button disabled class="w-64 btn-tmp">Can't Click Me</button>
                            </div>
                            <div class="mt-6">
                                <label class="input-label-tmp">add disabled</label>
                                <button disabled class="w-64 btn-add-tmp">Can't Click Me</button>
                            </div>
                            <div class="mt-6">
                                <label class="input-label-tmp">remove disabled</label>
                                <button disabled class="w-64 btn-remove-tmp">Can't Click Me</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-10">
                    <h1 class="font-medium text-2xl text-gray-600 mb-2">Secondary Buttons</h1>
                    <div class="sm:flex">
                        <div class="sm:mr-8">
                            <div class="">
                                <label class="input-label-tmp">default</label>
                                <button class="w-64 btn-secondary-tmp">Click Me</button>
                            </div>

                            <div class="mt-6">
                                <label class="input-label-tmp">add</label>
                                <button class="w-64 btn-secondary-add-tmp">Click Me</button>
                            </div>

                            <div class="mt-6">
                                <label class="input-label-tmp">remove</label>
                                <button class="w-64 btn-secondary-remove-tmp">Click Me</button>
                            </div>
                        </div>
                        <div class="sm:mt-0 mt-6">
                            <div class="">
                                <label class="input-label-tmp">normal disabled</label>
                                <button disabled class="w-64 btn-secondary-tmp">Can't Click Me</button>
                            </div>

                            <div class="mt-6">
                                <label class="input-label-tmp">add disabled</label>
                                <button disabled class="w-64 btn-secondary-add-tmp">Can't Click Me</button>
                            </div>

                            <div class="mt-6">
                                <label class="input-label-tmp">remove disabled</label>
                                <button disabled class="w-64 btn-secondary-remove-tmp">Can't Click Me</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-10">
                    <h1 class="font-medium text-2xl text-gray-600 mb-2">Tertiary Buttons</h1>

                    <div class="sm:flex">
                        <div class="sm:mr-8 sm:mt-0 mt-6 w-64">
                            <div class="">
                                <label class="input-label-tmp">default</label>
                                <button class="btn-tertiary-tmp">Click Me</button>
                            </div>

                            <div class="mt-6">
                                <label class="input-label-tmp">add</label>
                                <button class="btn-tertiary-add-tmp">Click Me</button>
                            </div>

                            <div class="mt-6">
                                <label class="input-label-tmp">remove</label>
                                <button class="btn-tertiary-remove-tmp">Click Me</button>
                            </div>
                        </div>
                        <div class="w-64">
                            <div class="">
                                <label class="input-label-tmp">normal default</label>
                                <button disabled class="btn-tertiary-tmp">Can't Click Me</button>
                            </div>

                            <div class="mt-6">
                                <label class="input-label-tmp">add default</label>
                                <button disabled class="btn-tertiary-add-tmp">Can't Click Me</button>
                            </div>

                            <div class="mt-6">
                                <label class="input-label-tmp">remove default</label>
                                <button disabled class="btn-tertiary-remove-tmp">Can't Click Me</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-12 sm:mt-0 space-y-10 w-64">
                <div>
                    <h1 class="font-medium text-2xl text-gray-600 mb-2">Switch (Toggle)</h1>
                    <div class="flex items-center space-x-4">
                        <i class="fa fa-sun text-3xl" :class="isDarkModeEnabled ? 'text-gray-400' : 'text-yellow-500'" />
                        <Switch
                            v-slot="{ checked }"
                            v-model="isDarkModeEnabled"
                            as="button"
                            class="relative inline-flex flex-shrink-0 items-center px-0.5 w-18 h-9 transition-colors duration-200 ease-in-out rounded-full cursor-pointer focus:outline-none focus:shadow-outline"
                            :class="isDarkModeEnabled ? 'bg-yellow-500' : 'bg-gray-600'"
                        >
                            <span
                                class="inline-block w-8 h-8 transition duration-200 ease-in-out transform bg-white rounded-full"
                                :class="{ 'translate-x-9': checked, 'translate-x-0': !checked }"
                            />
                        </Switch>
                        <i class="fa fa-moon text-3xl" :class="isDarkModeEnabled ? 'text-yellow-500' : 'text-gray-500'" />
                    </div>
                </div>
                <div>
                    <h1 class="font-medium text-2xl text-gray-600 mb-2">Selects</h1>
                    <div class="flex items-center justify-center">
                        <div class="w-full max-w-xs mx-auto">
                            <Listbox v-slot="{ open }" v-model="selectedPerson" as="div" class="space-y-1">
                                <ListboxLabel class="block text-sm leading-5 font-medium text-gray-700"> Assigned to </ListboxLabel>
                                <div class="relative">
                                    <span class="inline-block w-full rounded-md shadow-sm">
                                        <ListboxButton
                                            class="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                                        >
                                            <span class="block truncate">
                                                {{ selectedPerson }}
                                            </span>
                                            <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                                    <path
                                                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                        </ListboxButton>
                                    </span>

                                    <transition
                                        leave-active-class="transition ease-in duration-100"
                                        leave-from-class="opacity-100"
                                        leave-to-class="opacity-0"
                                    >
                                        <div v-if="open" class="absolute mt-1 w-full rounded-md bg-white shadow-lg">
                                            <ListboxOptions
                                                static
                                                class="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
                                            >
                                                <ListboxOption
                                                    v-for="person in people"
                                                    :key="person"
                                                    v-slot="{ selected, active }"
                                                    :value="person"
                                                >
                                                    <div
                                                        :class="`${
                                                            active ? 'text-white bg-blue-600' : 'text-gray-900'
                                                        } cursor-default select-none relative py-2 pl-8 pr-4`"
                                                    >
                                                        <span :class="`${selected ? 'font-semibold' : 'font-normal'} block truncate`">
                                                            {{ person }}
                                                        </span>
                                                        <span
                                                            v-if="selected"
                                                            :class="`${
                                                                active ? 'text-white' : 'text-blue-600'
                                                            } absolute inset-y-0 left-0 flex items-center pl-1.5`"
                                                        >
                                                            <svg
                                                                class="h-5 w-5"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { ref } from "vue";
    import { Switch, Listbox, ListboxLabel, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";

    export default {
        name: "Playground",
        components: {
            Switch,
            Listbox,
            ListboxLabel,
            ListboxButton,
            ListboxOptions,
            ListboxOption,
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

            const isDarkModeEnabled = ref(false);
            return { isDarkModeEnabled, people, selectedPerson };
        },
    };
</script>
