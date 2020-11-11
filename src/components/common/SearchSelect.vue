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
    <div
        v-show="optionsShown"
        :id="inputId + '_options'"
        class="bg-white overflow-auto max-h-50 border absolute border-gray-500 w-full text-gray-700 rounded-b-md"
    >
        <div v-if="filteredOptions.length > 0">
            <div
                v-for="(option, index) in filteredOptions"
                :key="option"
                class="p-2 text-md cursor-pointer block"
                :class="{ 'bg-blue-500 text-gray-100': index == hoveredOption }"
                @mousedown="selectOption(option)"
                @mouseover="setHoveredOption(index)"
            >
                {{ option.display }}
            </div>
        </div>
        <div v-else class="p-2 text-md block">No results found.</div>
    </div>
</template>

<script lang="ts">
    import { computed, ref, watch } from "vue";
    import SearchSelectOption from "@/use/helpers/SearchSelectOption";
    import { filter } from "cypress/types/bluebird";

    export default {
        name: "SearchSelect",
        props: {
            options: {
                type: Array,
                required: true,
            },
            selected: {
                type: Object,
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

            const hoveredOption = ref(-1);

            let filteredOptions = computed(() => {
                return (props.options as SearchSelectOption[]).filter((e) => e.display.toLowerCase().includes(input.value.toLowerCase()));
            });

            watch(
                () => props.selected,
                () => {
                    input.value = props.selected.display;
                }
            );

            watch(input, () => {
                // emit:    empty value if input of search select is not exactly the value of one displayed option
                //          the option that exactly matches the input string
                // Emitting empty values is needed for updating the v-model (parent component) and the connected input (this component), as it is watched.
                let tmp = (props.options as SearchSelectOption[]).filter((o) => o.display == input.value);
                if (tmp.length == 0) {
                    emit("update:selected", { value: {}, display: input.value } as SearchSelectOption);
                    hoveredOption.value = -1;
                    showOptions();
                } else if (tmp.length == 1) {
                    selectOption(tmp[0]);
                    hoveredOption.value = 0;
                }
            });

            function selectOption(option: SearchSelectOption) {
                emit("update:selected", option);
            }

            function showOptions() {
                optionsShown.value = true;
            }

            function keyMonitor(event: KeyboardEvent) {
                if (event.key === "Enter" && hoveredOption.value >= 0) {
                    selectOption(filteredOptions.value[hoveredOption.value]);
                    hideOptions();
                } else if (event.key == "ArrowUp" && hoveredOption.value >= 0) {
                    hoveredOption.value--;
                } else if (event.key == "ArrowDown" && hoveredOption.value < filteredOptions.value.length - 1) {
                    hoveredOption.value++;
                }
            }

            function hideOptions() {
                optionsShown.value = false;
                hoveredOption.value = -1;
            }

            function setHoveredOption(index: number) {
                hoveredOption.value = index;
            }

            return {
                showOptions,
                hideOptions,
                keyMonitor,
                selectOption,
                input,
                optionsShown,
                filteredOptions,
                hoveredOption,
                setHoveredOption,
            };
        },
    };
</script>
