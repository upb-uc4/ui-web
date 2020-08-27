<template>
    <div>
        <div v-for="index in output.length" :key="index" class="w-full flex flex-row items-center">
            <select
                :id="'fieldsOfStudy-' + index"
                v-model="output[index - 1]"
                class="input-select form-select mr-2 w-full"
                :class="{ 'mb-2': index !== output.length }"
                @change="addValue($event.target.value, index - 1)"
            >
                <option disabled :value="''">{{ placeholder }}</option>

                <!-- add selected option, because the computed "unchosenValues" will not contain it -->
                <option v-if="output[index - 1] != ''">{{ output[index - 1] }}</option>

                <option v-for="field in unchosenValues" :key="field">{{ field }}</option>
            </select>
            <div class="w-10 items-center justify-center" :class="{ 'mb-2': index !== output.length }">
                <button
                    v-if="output[index - 1] != ''"
                    :id="'removeFieldOfStudy-' + index"
                    title="Remove Selected Field Of Study"
                    class="btn-icon-red"
                    @click="removeValue(index - 1)"
                >
                    <i class="inline far fa-trash-alt text-lg"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, ref } from "vue";
    export default {
        name: "MultiSelect",
        props: {
            inputList: {
                type: Array,
                required: true,
            },
            preSelection: {
                type: Array,
                required: true,
            },
            placeholder: {
                type: String,
                required: true,
            },
        },
        emits: ["changed"],
        setup(props: any, { emit }: any) {
            let input = ref(props.inputList);
            let output = computed(() => {
                // add empty element of enumeration, if prop list is empty
                return props.preSelection.length == 0 ? [...(props.preSelection as string[]), ""] : [...(props.preSelection as string[])];
            });

            let unchosenValues = computed(() => {
                return input.value.filter((f: any) => !output.value.includes(f as string));
            });

            function addValue(value: any, index: number) {
                if (output.value.length - 1 == index) {
                    output.value.push("");
                }
                output.value[index] = value;
                emit("changed", output);
            }

            function removeValue(index: number) {
                output.value.splice(index, 1);
                emit("changed", output);
            }

            return {
                unchosenValues,
                addValue,
                removeValue,
                output,
            };
        },
    };
</script>
