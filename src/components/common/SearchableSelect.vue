<template>
    <input
        v-model="input"
        class="input-text-tmp w-full"
        :placeholder=placeholder
        @focus="show()"
        @blur="hide()"
        @keyup="keyMonitor"
    />
    <div
        v-show="!hidden"
        class="bg-white overflow-auto max-h-50 border border-gray-500 w-full text-gray-700 rounded-b-md"
    >
        <div v-if="hasMatch">
            <div
                v-for="(option, index) in matches"
                :key="option"
                class="p-2 text-md cursor-pointer block"
                :class="{ 'bg-blue-500 text-gray-100': index === hoveredOption }"
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

    export default {
        name: "SearchableSelect",
        props: {
            elements: {
                type: Array,
                required: true,
            },
            selected: {
                type: Object,
                required: true,
            },
            placeholder: {
                type: String,
                default: "Search for a Quote"
            }
        },
        emits: ["update:selected"],
        setup(props: any, { emit }: any) {
            const input = ref("");
            const hidden = ref(true);

            let matches = computed(() => {
                const elements = props.elements as SearchSelectOption[];
                return elements.filter(element => {
                    const needle = input.value.toLowerCase();
                    const haystack = element.display.toLocaleLowerCase();
                    return haystack.includes(needle);
                })
            });

            let hasMatch = ref(matches.value.length > 0)

            function show() {
                hidden.value = false;
            }

            function hide() {
                hidden.value = true;
                hoveredOption.value = -1;
            }

            const hoveredOption = ref(-1);

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
                    show();
                } else if (tmp.length == 1) {
                    selectOption(tmp[0]);
                    hoveredOption.value = 0;
                }
            });

            function selectOption(option: SearchSelectOption) {
                emit("update:selected", option);
            }

            function keyMonitor(event: KeyboardEvent) {
                if (event.key === "Enter" && hoveredOption.value >= 0) {
                    selectOption(matches.value[hoveredOption.value]);
                    hide();
                } else if (event.key == "ArrowUp" && hoveredOption.value >= 0) {
                    hoveredOption.value--;
                } else if (event.key == "ArrowDown" && hoveredOption.value < matches.value.length - 1) {
                    hoveredOption.value++;
                }
            }

            function setHoveredOption(index: number) {
                hoveredOption.value = index;
            }

            return {
                input,
                hidden,
                show,
                hide,
                keyMonitor,
                selectOption,
                matches,
                hasMatch,
                hoveredOption,
                setHoveredOption,
            };
        },
    }
</script>