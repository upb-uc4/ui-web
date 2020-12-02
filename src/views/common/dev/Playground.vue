<template>
    <div>
        <div class="bg-gray-100 dark:bg-gray-800 p-10 mt-10 rounded-lg w-full sm:flex justify-between">
            <div>
                <h1 class="font-medium text-2xl text-gray-600 dark:text-blue-200 mb-2">Inputs</h1>
                <div class="space-y-6">
                    <div class="">
                        <label class="input-label-tmp">default</label>
                        <input type="text" autofocus class="w-64 input-text-tmp" value="empty" />
                    </div>

                    <div class="">
                        <label class="input-label-tmp">placeholder</label>
                        <input type="text" class="w-64 input-text-tmp" placeholder="empty" />
                    </div>

                    <div class="">
                        <label class="input-label-tmp">disabled</label>
                        <input type="text" disabled class="w-64 input-text-tmp" value="empty" />
                    </div>

                    <div class="">
                        <label class="input-label-tmp">readonly</label>
                        <input type="text" readonly class="w-64 input-text-tmp" value="empty" />
                    </div>

                    <div class="">
                        <label class="input-label-tmp">error</label>
                        <input type="text" class="w-64 input-text-error-tmp" value="empty" />
                        <label class="input-label-error-tmp">This indicates that something is wrong.</label>
                    </div>

                    <div class="">
                        <label class="input-label-tmp">warning</label>
                        <input type="text" class="w-64 input-text-warning-tmp" value="empty" />
                        <label class="input-label-warning-tmp">This is a warning.</label>
                    </div>

                    <div class="">
                        <label class="input-label-tmp">text area</label>
                        <textarea rows="3" class="w-64 input-text-tmp" />
                    </div>
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
                    <dark-mode-toggle />
                </div>
                <div>
                    <h1 class="font-medium text-2xl text-gray-600 mb-2">Selects</h1>
                    <Select v-model:elements="people" :selected-element="selectedPerson" />
                </div>
                <div>
                    <h1 class="font-medium text-2xl text-gray-600 mb-2">Search Selects</h1>
                    <searchable-select v-model:elements="quotes" input-id="playground" />
                </div>
                <div>
                    <h1 class="font-medium text-2xl text-gray-600 mb-2">Radio Buttons <span class="text-yellow-600">(TODO)</span></h1>
                    <div class="flex space-x-8">
                        <label class="flex items-center">
                            <input v-model="picked" type="radio" class="radio" value="A" />
                            <span class="ml-2">Student</span>
                        </label>
                        <label class="flex items-center">
                            <input v-model="picked" type="radio" class="radio" value="B" />
                            <span class="ml-2">Lecturer</span>
                        </label>
                    </div>
                </div>
                <div>
                    <h1 class="font-medium text-2xl text-gray-600 mb-2">Checkboxes <span class="text-yellow-600">(TODO)</span></h1>
                    <div class="flex space-x-4 items-center">
                        <input type="checkbox" checked />
                        <label>Do nothing</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { ref } from "vue";
    import Select from "@/components/common/Select.vue";
    import SearchableSelect from "@/components/common/SearchableSelect.vue";
    import SearchSelectOption from "@/use/helpers/SearchSelectOption";
    import DarkModeToggle from "@/components/common/DarkModeToggle.vue";

    export default {
        name: "Playground",
        components: {
            Select,
            DarkModeToggle,
            SearchableSelect,
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

            const quotes: SearchSelectOption[] = [
                { value: "something", display: "Ai Caramba" },
                { value: "something else", display: "I'll be back" },
                { value: "something else too", display: "Hakuna Matata" },
            ];

            const picked = ref("A");

            return { people, selectedPerson, picked, quotes };
        },
    };
</script>
