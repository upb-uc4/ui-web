<template>
    <input
        :id="inputId"
        v-model="input"
        class="form-select input-select block w-full"
        placeholder="Select a Lecturer"
        @focus="showOptions()"
        @blur="hideOptions()"
        @keyup="keyMonitor"
    />
    <div v-show="optionsShown" :id="inputId + '_options'" class="bg-white overflow-auto max-h-50 border absolute border-gray-500 w-full">
        <div
            v-for="option in filteredOptions"
            :key="option"
            class="text-gray-600 p-2 text-md cursor-pointer hover:bg-blue-500 hover:text-gray-100 block"
            @mousedown="selectOption(option)"
        >
            {{ option }}
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, ref, watch } from "vue";

    export default {
        name: "SearchSelect",
        props: {
            options: {
                type: Array,
                required: true,
            },
            selected: {
                type: String,
                required: true,
            },
            inputId: {
                type: String,
                required: true,
            },
        },
        emits: ["update:selected"],
        setup(props: any, { emit }: any) {
            const optionsShown = ref(false);
            const input = ref("");

            let filteredOptions = computed(() => {
                return (props.options as String[]).filter((e) => e.toLowerCase().includes(input.value.toLowerCase()));
            });

            watch(
                () => props.selected,
                () => {
                    input.value = props.selected;
                }
            );

            watch(input, () => {
                emit("update:selected", input.value);
            });

            function selectOption(option: String) {
                emit("update:selected", option);
            }

            function showOptions() {
                optionsShown.value = true;
            }

            function keyMonitor(event: KeyboardEvent) {
                if (event.key === "Enter" && filteredOptions.value[0]) {
                    selectOption(filteredOptions.value[0]);
                }
            }

            function hideOptions() {
                optionsShown.value = false;
            }

            return { showOptions, hideOptions, keyMonitor, selectOption, input, optionsShown, filteredOptions };
        },
    };
</script>
